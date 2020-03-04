import { addDays, addHours } from "date-fns";
import randomColor from "randomcolor";
export const initialState = {
  auth: {
    status: "ANONYMOUS",
    id: 1
  },
  events: [
    {
      id: 1,
      name: "testing event 1",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      familyMembers: ["1", "2"],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addDays(new Date(), 10)],
      eventType: "Event"
    },
    {
      id: 2,
      name: "testing event 2",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Canceled",
      familyMembers: ["1", "2"],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 1)],
      eventType: "Event"
    },
    {
      id: 3,
      name: "testing event 3",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Scheduled",
      familyMembers: ["1", "2"],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 2)],
      eventType: "Event"
    },
    {
      id: 4,
      name: "testing event 4",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Scheduled",
      familyMembers: ["1", "2"],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 2)],
      eventType: "Event"
    },
    {
      id: 5,
      name: "testing event 5",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Scheduled",
      familyMembers: ["1", "2"],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 2)],
      eventType: "Event"
    }
  ],
  calendars: [
    {
      id: 1,
      userId: 1,
      name: "test 1",
      familyMembers: ["1", "2"],
      image: "https://picsum.photos/200",
      color: randomColor()
    }
  ],
  familyMembers: [
    {
      id: 1,
      userId: 1,
      name: "Bon Mercado",
      color: randomColor()
    },
    {
      id: 2,
      userId: 1,
      name: "Test Name 1",
      color: randomColor()
    },
    {
      id: 3,
      userId: 1,
      name: "Test Name 2",
      color: randomColor()
    }
  ],
  contacts: [
    {
      id: 1,
      userIds: [1],
      firstName: "Black",
      lastName: "Hat",
      phoneNumber: "0200202",
      email: "test2@yahoo.com",
      relation: "Sibling"
    },
    {
      id: 2,
      userIds: [1],
      firstName: "Bon",
      lastName: "Mercado",
      phoneNumber: "92900912",
      email: "test@yahoo.com",
      relation: "Parent"
    }
  ],
  groups: [
    {
      id: 1,
      userIds: [1],
      contacts: [],
      name: "testing groups 1"
    },
    {
      id: 2,
      userIds: [1],
      contacts: [],
      name: "testing groups 2"
    }
  ],
  settings: {
    lifeEvents: [
      "Passing love",
      "Challenge in school",
      "Bullying",
      "Challenges with love ones",
      "Behavioral issues",
      "Encouragement",
      "Stretching"
    ]
  }
};
