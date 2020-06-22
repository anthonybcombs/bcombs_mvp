import React from "react";
import { eachDayOfInterval, format, isAfter, getDaysInMonth } from "date-fns";
import DataTable from "react-data-table-component";
import { getWeekIndex } from "../../../../helpers/datetime";
const monthList = [
  { name: "January", value: 0 },
  { name: "February", value: 1 },
  { name: "March", value: 2 },
  { name: "April", value: 3 },
  { name: "May", value: 4 },
  { name: "June", value: 5 },
  { name: "July", value: 6 },
  { name: "August", value: 7 },
  { name: "September", value: 8 },
  { name: "October", value: 9 },
  { name: "November", value: 10 },
  { name: "December", value: 11 }
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

const getColumns = (selectedYear, month, index) => {
  return [
    {
      name: "Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Date",
      selector: "event_start_date",

      cell: event => {
        let startDate = null;
        if (event.recurring !== "") {
          let startDateInMonth = new Date(`${selectedYear}-${month}-01`);
          let lastDateInMonth = new Date(
            `${selectedYear}-${month}-${getDaysInMonth(
              new Date(selectedYear, index)
            )}`
          );

          if (event.recurring === "Daily") {
            if (event.recurring_end_date === null) {
              startDate = `${format(startDateInMonth, DATE)} - ${format(
                lastDateInMonth,
                DATE
              )}`;
            } else {
              let isLastDayOfMonthAfter = isAfter(
                lastDateInMonth,
                new Date(event.recurring_end_date)
              );
              startDate = `${format(startDateInMonth, DATE)} - ${format(
                isLastDayOfMonthAfter
                  ? new Date(event.recurring_end_date)
                  : lastDateInMonth,
                DATE
              )}`;
            }
          } else if (event.recurring === "Weekly") {
            let dateRange = getDayInterval(startDateInMonth, lastDateInMonth);

            if (event.recurring_end_date) {
              startDate = dateRange.filter(date => {
                let isLastDayOfMonthAfter =
                  event.recurring_end_date &&
                  isAfter(new Date(event.recurring_end_date), date);
                return (
                  isLastDayOfMonthAfter &&
                  format(new Date(date), "EEEE") ===
                    format(new Date(event.start_of_event), "EEEE")
                );
              });
            } else {
              startDate = dateRange.filter(date => {
                return (
                  format(new Date(date), "EEEE") ===
                  format(new Date(event.start_of_event), "EEEE")
                );
              });
            }
          } else if (event.recurring === "Monthly") {
            let dateRange = getDayInterval(startDateInMonth, lastDateInMonth);

            let currentWeekIndex = getWeekIndex(
              new Date(event.start_of_event).getDate()
            );

            startDate = `${format(
              new Date(dateRange[currentWeekIndex]),
              DATE
            )}`;
          } else if (event.recurring === "Annually") {
            let dateRange = getDayInterval(startDateInMonth, lastDateInMonth);
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
          startDate = format(new Date(event.start_of_event), DATE);
        }
        return Array.isArray(startDate) ? (
          <ul>
            {startDate.map(date => (
              <li className="week-list">{format(date, DATE)}</li>
            ))}
          </ul>
        ) : (
          startDate
        );
      }
    },
    {
      name: "Time",
      selector: "start_of_event",
      sortable: true,
      cell: event => {
        const startTime = format(new Date(event.start_of_event), "hh:mm a");
        const endTime = format(new Date(event.end_of_event), "hh:mm a");

        return (
          <div>
            {startTime}
            {` `}
            {startTime !== endTime ? ` - ${endTime}` : ""}
          </div>
        );
      }
    },
    {
      name: "Recurring",
      selector: "recurring",
      sortable: true,
      cell: event => {
        return event.recurring;
      }
    },
    {
      name: "Location",
      selector: "location",
      sortable: true,
      cell: event => {
        return event.location;
      }
    }
  ];
};

const getEventOnMonth = (events, month, selectedYear) => {
  return events.filter(event => {
    if (
      hasEventRecurring(event.recurring) &&
      event.recurring_end_date === null &&
      new Date(event.start_of_event).getMonth() <= month.value &&
      format(new Date(event.start_of_event), "yyyy") === selectedYear
    ) {
      return true;
    } else if (
      hasEventRecurring(event.recurring) &&
      event.recurring_end_date &&
      new Date(event.start_of_event).getMonth() <= month.value &&
      month.value <= new Date(event.recurring_end_date).getMonth() &&
      new Date(event.start_of_event).getMonth() <=
        new Date(event.recurring_end_date).getMonth() &&
      format(new Date(event.start_of_event), "yyyy") === selectedYear
    ) {
      return true;
    } else if (
      event.recurring === "Annually" &&
      new Date(event.start_of_event).getMonth() === month.value
    ) {
      if (
        !event.recurring_end_date ||
        (event.recurring_end_date &&
          selectedYear <= new Date(event.recurring_end_date).getFullYear())
      ) {
        return true;
      }
    }

    return (
      format(new Date(event.start_of_event), "MMMM") === month.name &&
      format(new Date(event.start_of_event), "yyyy") === selectedYear
    );
  });
};

const customStyles = {
  header: {
    style: {
      minHeight: "70px"
    }
  },
  subHeader: {
    style: {
      marginBottom: "12px"
    }
  },
  headRow: {
    style: {
      background: "#f26e21",
      minHeight: "39px",
      borderColor: "#fff"
    }
  },
  headCells: {
    style: {
      fontSize: "16px",
      color: "#fff"
    }
  },
  cells: {
    style: {
      fontSize: "16px",
      padding: "10px"
    }
  },
  rows: {
    style: {
      "&:not(:last-of-type)": {
        borderColor: "#eaedf1"
      },
      minHeight: "35px"
    }
  }
};

const paginationRowsPerPageOptions = [10, 25, 50, 100];
const paginationComponentOptions = {
  rowsPerPageText: "Rows per page:",
  rangeSeparatorText: "of",
  noRowsPerPage: false,
  selectAllRowsItem: true,
  selectAllRowsItemText: "All"
};

const DATE = "MM/dd/yyyy";
export default function index({ events, selectedYear, familyMembers }) {
  const currentMonth = new Date().getMonth();
  const currentYear = format(new Date(), "yyyy");
  const pastMonths = monthList.filter(
    (month, index) => currentMonth > month.value
  );
  const futureMonths = monthList.filter(
    (month, index) => currentMonth < month.value
  );

  const eventOnThisMonth = monthList.filter(
    (month, index) => currentMonth === month.value
  );
  return (
    <div data-testid="app-dashboard-my-events-body" id="events-body">
      {currentYear === selectedYear ? (
        <>
          {eventOnThisMonth
            .filter((month, index) => {
              if (currentYear === selectedYear) {
                return month.value <= 12;
              }
              return true;
            })

            .map((month, index) => {
              const eventThisMonth = getEventOnMonth(
                events,
                month,
                selectedYear
              );
              return (
                <div
                  className="event-separator"
                  data-testid="app-dashboard-my-events-body-events-month"
                  key={month.value}>
                  {eventThisMonth.length === 0 && <p>No events scheduled</p>}
                  {eventThisMonth.length > 0 && (
                    <div id="eventTableContainer">
                      <DataTable
                        columns={getColumns(
                          selectedYear,
                          month.name,
                          month.value
                        )}
                        data={eventThisMonth}
                        pagination
                        striped={true}
                        customStyles={customStyles}
                        paginationRowsPerPageOptions={
                          paginationRowsPerPageOptions
                        }
                        paginationComponentOptions={paginationComponentOptions}
                        title={month.name}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          <div>
            {futureMonths
              .filter((month, index) => {
                if (currentYear === selectedYear) {
                  return month.value <= 12;
                }
                return true;
              })

              .map((month, index) => {
                const eventThisMonth = getEventOnMonth(
                  events,
                  month,
                  selectedYear
                );
                return (
                  <div
                    className="event-separator"
                    data-testid="app-dashboard-my-events-body-events-month"
                    key={month.value}>
                    <div id="eventTableContainer">
                      <DataTable
                        columns={getColumns(
                          selectedYear,
                          month.name,
                          month.value
                        )}
                        data={eventThisMonth}
                        pagination
                        // noHeader={true}
                        striped={true}
                        customStyles={customStyles}
                        paginationRowsPerPageOptions={
                          paginationRowsPerPageOptions
                        }
                        paginationComponentOptions={paginationComponentOptions}
                        title={month.name}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div>
            <h2>Past Events</h2>
            {pastMonths
              .filter((month, index) => {
                if (currentYear === selectedYear) {
                  return month.value <= 12;
                }
                return true;
              })

              .map((month, index) => {
                const eventThisMonth = getEventOnMonth(
                  events,
                  month,
                  selectedYear
                );
                return (
                  <div
                    className="event-separator"
                    data-testid="app-dashboard-my-events-body-events-month"
                    key={month.value}>
                    <div id="eventTableContainer">
                      <DataTable
                        columns={getColumns(
                          selectedYear,
                          month.name,
                          month.value
                        )}
                        data={eventThisMonth}
                        pagination
                        striped={true}
                        customStyles={customStyles}
                        paginationRowsPerPageOptions={
                          paginationRowsPerPageOptions
                        }
                        paginationComponentOptions={paginationComponentOptions}
                        title={month.name}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <div>
          {monthList
            .filter((month, index) => {
              if (currentYear === selectedYear) {
                return month.value <= 12;
              }
              return true;
            })

            .map((month, index) => {
              const eventThisMonth = getEventOnMonth(
                events,
                month,
                selectedYear
              );
              return (
                <div
                  data-testid="app-dashboard-my-events-body-events-month"
                  key={month.value}>
                  {/* {eventThisMonth.length === 0 && <p>No events scheduled</p>} */}

                  <div id="eventTableContainer">
                    <DataTable
                      columns={getColumns(
                        selectedYear,
                        month.name,
                        month.value
                      )}
                      data={eventThisMonth}
                      pagination
                      striped={true}
                      customStyles={customStyles}
                      subHeader
                      paginationRowsPerPageOptions={
                        paginationRowsPerPageOptions
                      }
                      paginationComponentOptions={paginationComponentOptions}
                      title={month.name}
                    />
                  </div>

                  <hr />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
