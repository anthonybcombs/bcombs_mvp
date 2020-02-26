import React from "react";
import { format, getMonth } from "date-fns";
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
export default function index({ events, selectedYear, familyMembers }) {
  const currentYear = format(new Date(), "yyyy");
  return (
    <div data-testid="app-dashboard-my-events-body" id="events-body">
      {monthList
        .filter((month, index) => {
          if (currentYear === selectedYear) {
            return index <= getMonth(new Date());
          }
          return true;
        })
        .reverse()
        .map(month => {
          const eventThisMonth = events.filter(
            event =>
              format(event.date, "MMMM") === month &&
              format(event.date, "yyyy") === selectedYear
          );
          return (
            <div
              data-testid="app-dashboard-my-events-body-events-month"
              key={month}
            >
              <h2 data-testid="app-dashboard-my-events-body-table-month">
                {month}
              </h2>
              {eventThisMonth.length === 0}
              {<p>No events scheduled</p>}
              {eventThisMonth.length > 0 && (
                <table data-testid="app-dashboard-my-events-body-table">
                  <thead>
                    <tr>
                      <th>Event name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Shared with:</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventThisMonth.map(event => (
                      <tr key={event.id}>
                        <td>{event.name}</td>
                        <td>{format(event.date, "MM/dd/yyyy")}</td>
                        <td>{event.time}</td>
                        <td>{event.location}</td>
                        <td>
                          {event.familyMembers.map(eventFamilyMemberId => (
                            <p key={eventFamilyMemberId}>
                              {
                                familyMembers.find(
                                  familyMember =>
                                    familyMember.id ===
                                    parseInt(eventFamilyMemberId)
                                )["name"]
                              }
                            </p>
                          ))}
                        </td>
                        <td>{event.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
    </div>
  );
}
