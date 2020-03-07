import { addDays, addHours } from "date-fns";
import { uuid } from "uuidv4";
import randomColor from "randomcolor";
export const initialState = {
  auth: {
    status: "ANONYMOUS",
    id: 1
  },
  events: [
    {
      id: uuid(),
      name: "testing event 1",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      familyMembers: [],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addDays(new Date(), 10)],
      eventType: "Event"
    },
    {
      id: uuid(),
      name: "testing event 2",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Canceled",
      familyMembers: [],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 1)],
      eventType: "Event"
    },
    {
      id: uuid(),
      name: "testing event 3",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Scheduled",
      familyMembers: [],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 2)],
      eventType: "Event"
    },
    {
      id: uuid(),
      name: "testing event 4",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Scheduled",
      familyMembers: [],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 2)],
      eventType: "Event"
    },
    {
      id: uuid(),
      name: "testing event 5",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date(),
      image: "https://picsum.photos/200",
      location: "PH",
      time: "1pm-5pm",
      status: "Scheduled",
      familyMembers: [],
      eventGuests: [],
      eventCategory: "Entertainment",
      eventSchedule: [new Date(), addHours(new Date(), 2)],
      eventType: "Event"
    }
  ],
  calendars: [
    {
      id: uuid(),
      userId: uuid(),
      name: "test 1",
      familyMembers: ["1", "2"],
      image: "https://picsum.photos/200",
      color: randomColor()
    }
  ],
  familyMembers: [
    {
      id: uuid(),
      userId: uuid(),
      name: "Bon Mercado",
      color: randomColor()
    },
    {
      id: uuid(),
      userId: uuid(),
      name: "Test Name 1",
      color: randomColor()
    },
    {
      id: uuid(),
      userId: uuid(),
      name: "Test Name 2",
      color: randomColor()
    }
  ],
  contacts: [
    {
      id: uuid(),
      userIds: [1],
      firstName: "Black",
      lastName: "Hat",
      phoneNumber: "0200202",
      email: "test2@yahoo.com",
      relation: "Sibling"
    },
    {
      id: uuid(),
      userIds: [1],
      firstName: "Bon",
      lastName: "Mercado",
      phoneNumber: "92900912",
      email: "test@yahoo.com",
      relation: "Parent"
    }
  ],
  relatives: [],
  groups: [
    {
      id: uuid(),
      userIds: [1],
      contacts: [],
      name: "testing groups 1"
    },
    {
      id: uuid(),
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
