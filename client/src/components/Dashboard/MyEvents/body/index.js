import React from "react";
import {
  eachDayOfInterval,
  format,
  getMonth,
  isAfter,
  getDaysInMonth
} from "date-fns";

import { getWeekIndex } from "../../../../helpers/datetime";
const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const hasEventRecurring = recurring => {
  return (
    recurring === "Daily" || recurring === "Weekly" || recurring === "Monthly"
  );
};

const getDayInterval = (startDate, endDate) => {
  return eachDayOfInterval({
    start: startDate,
    end: endDate
  }).map(date => new Date(date));
};

const DATE = "MM/dd/yyyy";
export default function index({ events, selectedYear, familyMembers }) {
  const currentYear = format(new Date(), "yyyy");
  return (
    <div data-testid="app-dashboard-my-events-body" id="events-body">
      {monthList
        .filter((month, index) => {
          if (currentYear === selectedYear) {
            return index <= 12;
          }
          return true;
        })

        .map((month, index) => {
          const eventThisMonth = events.filter(event => {
            if (
              hasEventRecurring(event.recurring) &&
              event.recurring_end_date === null &&
              new Date(event.start_of_event).getMonth() <= index &&
              format(new Date(event.start_of_event), "yyyy") === selectedYear
            ) {
              return true;
            } else if (
              hasEventRecurring(event.recurring) &&
              event.recurring_end_date &&
              new Date(event.start_of_event).getMonth() <= index &&
              index <= new Date(event.recurring_end_date).getMonth() &&
              new Date(event.start_of_event).getMonth() <=
                new Date(event.recurring_end_date).getMonth() &&
              format(new Date(event.start_of_event), "yyyy") === selectedYear
            ) {
              return true;
            } else if (
              event.recurring === "Annually" &&
              new Date(event.start_of_event).getMonth() === index
            ) {
              if (
                !event.recurring_end_date ||
                (event.recurring_end_date &&
                  selectedYear <=
                    new Date(event.recurring_end_date).getFullYear())
              ) {
                return true;
              }
            }

            return (
              format(new Date(event.start_of_event), "MMMM") === month &&
              format(new Date(event.start_of_event), "yyyy") === selectedYear
            );
          });
          return (
            <div
              data-testid="app-dashboard-my-events-body-events-month"
              key={month}>
              <h2 data-testid="app-dashboard-my-events-body-table-month">
                {month}
              </h2>
              {eventThisMonth.length === 0 && <p>No events scheduled</p>}
              {eventThisMonth.length > 0 && (
                <table data-testid="app-dashboard-my-events-body-table">
                  <thead>
                    <tr>
                      <th>Event name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Recurring</th>
                      <th>Location</th>
                      <th>Shared with:</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventThisMonth.map(event => {
                      let startDate = null;

                      if (event.recurring !== "") {
                        let startDateInMonth = new Date(
                          `${selectedYear}-${month}-01`
                        );
                        let lastDateInMonth = new Date(
                          `${selectedYear}-${month}-${getDaysInMonth(
                            new Date(selectedYear, index)
                          )}`
                        );

                        if (event.recurring === "Daily") {
                          if (event.recurring_end_date === null) {
                            startDate = `${format(
                              startDateInMonth,
                              DATE
                            )} - ${format(lastDateInMonth, DATE)}`;
                          } else {
                            let isLastDayOfMonthAfter = isAfter(
                              lastDateInMonth,
                              new Date(event.recurring_end_date)
                            );
                            startDate = `${format(
                              startDateInMonth,
                              DATE
                            )} - ${format(
                              isLastDayOfMonthAfter
                                ? new Date(event.recurring_end_date)
                                : lastDateInMonth,
                              DATE
                            )}`;
                          }
                        } else if (event.recurring === "Weekly") {
                          let dateRange = getDayInterval(
                            startDateInMonth,
                            lastDateInMonth
                          );

                          if (event.recurring_end_date) {
                            startDate = dateRange.filter(date => {
                              let isLastDayOfMonthAfter =
                                event.recurring_end_date &&
                                isAfter(
                                  new Date(event.recurring_end_date),
                                  date
                                );
                              return (
                                isLastDayOfMonthAfter &&
                                format(new Date(date), "EEEE") ===
                                  format(new Date(event.start_of_event), "EEEE")
                              );
                            });
                            console.log(
                              "startDate event.recurring_end_date",
                              startDate
                            );
                          } else {
                            startDate = dateRange.filter(date => {
                              return (
                                format(new Date(date), "EEEE") ===
                                format(new Date(event.start_of_event), "EEEE")
                              );
                            });
                          }

                          console.log("startDateeee", startDate);
                        } else if (event.recurring === "Monthly") {
                          let dateRange = getDayInterval(
                            startDateInMonth,
                            lastDateInMonth
                          );

                          let currentWeekIndex = getWeekIndex(
                            new Date(event.start_of_event).getDate()
                          );

                          startDate = `${format(
                            new Date(dateRange[currentWeekIndex]),
                            DATE
                          )}`;
                        } else if (event.recurring === "Annually") {
                          let dateRange = getDayInterval(
                            startDateInMonth,
                            lastDateInMonth
                          );
                          let currentWeekIndex = getWeekIndex(
                            new Date(event.start_of_event).getDate()
                          );

                          startDate = `${format(
                            new Date(
                              `${selectedYear}-${month}-${new Date(
                                dateRange[currentWeekIndex]
                              ).getDate()}`
                            ),
                            DATE
                          )}`;
                        }
                      } else {
                        startDate = format(
                          new Date(event.start_of_event),
                          DATE
                        );
                      }

                      const endDate =
                        event.recurring &&
                        event.recurring !== "No Repeat" &&
                        event.recurring !== ""
                          ? ""
                          : format(new Date(event.end_of_event), DATE);
                      const startTime = format(
                        new Date(event.start_of_event),
                        "hh:mm a"
                      );
                      const endTime = format(
                        new Date(event.end_of_event),
                        "hh:mm a"
                      );
                      return (
                        <tr className="event-rows" key={event.id}>
                          <td>{event.name}</td>
                          <td>
                            {Array.isArray(startDate)
                              ? startDate.map(date => (
                                  <div className="week-list">
                                    {format(date, DATE)}
                                  </div>
                                ))
                              : startDate}
                            {/* 
                            {startDate !== endDate && endDate !== ""
                              ? ` - ${endDate}`
                              : ""} */}
                          </td>
                          <td>
                            {/* {format(event.eventSchedule[0], "hh:mm a")}-
                            {format(event.eventSchedule[1], "hh:mm a")} */}
                            {startTime}{" "}
                            {startTime !== endTime && event.recurring_end_date
                              ? ` - ${endTime}`
                              : ""}
                          </td>
                          <td>{event.recurring}</td>
                          <td>{event.location}</td>
                          <td>
                            {/* {event.familyMembers.map(eventFamilyMemberId => (
                              <p key={eventFamilyMemberId}>
                                {
                                  familyMembers.find(
                                    familyMember =>
                                      familyMember.id === eventFamilyMemberId
                                  )["name"]
                                }
                              </p>
                            ))} */}
                          </td>
                          <td>{event.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
        .reverse()}
    </div>
  );
}
