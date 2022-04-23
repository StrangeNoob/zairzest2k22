const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const { Events, Team, EventRegistration } = require("../models");
const { calculateSHA256 } = require("../utils/crypto");

const getAllByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Events.find({ category: category });
    return res.status(StatusCodes.OK).send({
      message: "User signed in successfully",
      data: events,
      error: {},
      status: StatusCodes.OK,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      data: {},
      error: {
        message: err.message,
      },
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const getById = async (req, res) => {};

const postRegisterEvent = async (req, res) => {
  try {
    let event;
    try {
      const event_id = new mongoose.Types.ObjectId(req.params.eventId);
      if (req.body.team_id) {
        // Only for joining a team
        event = await Events.findById(event_id).exec();
      } else {
        // For creating new team or for new registration
        event = await Events.findOneAndUpdate(
          {
            _id: req.params.eventID,
            $or: [
              { registration_limit: null },
              {
                $expr: {
                  $lt: ["$registered", "$registration_limit"],
                },
              },
            ],
          },
          { $inc: { registered: 1 } },
          { new: true }
        ).exec();
      }
      assert(event);
    } catch (e) {
      res.status(404);
      res.send({
        status: "fail",
        message: "No more slots available forEventRegistration this event",
      });
      return;
    }

    if (req.body.extra_data) {
      let unknownFields = Object.keys(req.body.extra_data).filter(
        (x) => !event.extra_data.includes(x)
      );
      if (unknownFields.length > 0) {
        return res
          .status(401)
          .json({ status: "fail", message: "Updating unknown fields" });
      }
    }

    if (req.body.team_extra_data) {
      let unknownFields = Object.keys(req.body.team_extra_data).filter(
        (x) => !event.team_extra_data.includes(x)
      );
      if (unknownFields.length > 0) {
        return res
          .status(401)
          .json({ status: "fail", message: "Updating unknown fields" });
      }
    }

    try {
      if (event.max_participants == 1) {
        // Individual events
        await new EventRegistration({
          event_id: event._id,
          participant_id: req.user._id,
          extra_data: req.body.extra_data,
        })
          .save()
          .then((regdata) =>
            res.status(200).send({
              status: "success",
              data: {
                registered: true,
                extra_data: req.body.extra_data,
              },
            })
          )
          .catch(async (err) => {
            await Events.findByIdAndUpdate(event._id, {
              $inc: {
                registered: -1,
              },
            }).exec();
            return res.status(400).send({
              status: "fail",
              message: "You are already registered",
            });
          });
      } else if (req.body.team_id) {
        // Team events: Join a team
        const team = await Team.findOneAndUpdate(
          {
            _id: req.body.team_id,
            member_count: {
              $lt: event.max_participants,
            },
          },
          {
            $inc: {
              member_count: 1,
            },
          }
        ).exec();
        if (team) {
          const regdata = await new EventRegistration({
            event_id: event._id,
            participant_id: req.user._id,
            team_id: team._id,
            extra_data: req.body.extra_data,
          })
            .save()
            .then((regdata) => {
              return res.status(200).send({
                status: "success",
                data: {
                  registered: true,
                  team_id: team._id,
                  team_name: team.name,
                  extra_data: regdata.extra_data,
                  team_extra_data: team.team_extra_data,
                },
              });
            })
            .catch(async (err) => {
              await Team.findByIdAndUpdate(req.body.team_id, {
                $inc: {
                  member_count: -1,
                },
              }).exec();
              return res.status(400).send({
                status: "fail",
                message: "You are already registered",
              });
            });
        } else {
          return res.status(400).send({
            status: "fail",
            message: "Team full or Invalid Team ID",
          });
        }
      } else if (req.body.team_name) {
        // Team events: Create a team
        const team = new Team({
          _id: calculateSHA256(TEAM_ID_LENGTH, req.body.team_name, event._id),
          name: req.body.team_name,
          event_id: event._id,
          team_extra_data: req.body.team_extra_data,
          member_count: 1,
        });

        try {
          await team.save();
        } catch {
          await Events.findByIdAndUpdate(event._id, {
            $inc: {
              registered: -1,
            },
          }).exec();
          return res.status(400).send({
            status: "fail",
            message: "Use a different team name",
          });
        }
        await new EventRegistration({
          event_id: event._id,
          participant_id: req.user._id,
          team_id: team._id,
          extra_data: req.body.extra_data,
        })
          .save()
          .then((regdata) =>
            res.status(200).send({
              status: "success",
              data: {
                registered: true,
                team_id: team._id,
                team_name: team.name,
                extra_data: regdata.extra_data,
                team_extra_data: team.team_extra_data,
              },
            })
          )
          .catch(async (err) => {
            team.remove();
            await Events.findByIdAndUpdate(event._id, {
              $inc: {
                registered: -1,
              },
            }).exec();
            return res.status(400).send({
              status: "fail",
              message: "You are already registered",
            });
          });
      } else {
        return res.status(400).send({
          status: "fail",
          message: "Insufficient parameters",
        });
      }
    } catch (e) {
      // TODO: Better error handling to tell apart DB write errors from validation/uniqueness errors
      res.status(500).send({
        status: "fail",
        message: "Sorry, Please try a different team name or try again later",
      });
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      data: {},
      error: {
        message: err.message,
      },
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const postDeRegisterEvent = async (req, res) => {
  let event;
  try {
    const event_id = new mongoose.Types.ObjectId(req.params.eventId);
    event = await Events.findById(event_id).exec();
    assert(event);
  } catch (e) {
    res.status(404);
    res.send({ status: "fail", message: "Invalid Events ID" });
    return;
  }
  let registration_data;
  try {
    registration_data = await EventRegistration.findOneAndDelete({
      participant_id: req.user._id,
      event_id: event._id,
    }).exec();
    assert(registration_data);
    res.status(200).send({ status: "success", data: { registered: false } });
  } catch (e) {
    return res.status(500).send({
      status: "fail",
      message: "Sorry, There seems to be a problem at our end",
    });
  }

  try {
    if (registration_data?.team_id) {
      const team = await Team.findByIdAndUpdate(
        registration_data.team_id,
        {
          $inc: {
            member_count: -1,
          },
        },
        {
          new: true,
        }
      ).exec();
      if (team.member_count == 0) {
        team.remove();
        await Events.findByIdAndUpdate(event._id, {
          $inc: {
            registered: -1,
          },
        }).exec();
      }
    } else {
      await Events.findByIdAndUpdate(event._id, {
        $inc: {
          registered: -1,
        },
      }).exec();
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getAllByCategory,
  postRegisterEvent,
  postDeRegisterEvent,
  getById,
};
