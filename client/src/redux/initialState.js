import { addDays } from "date-fns";

export const initialState = {
  auth: {
    status: "ANONYMOUS"
  },
  events: [
    {
      id: 1,
      name: "testing event 1",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: addDays(new Date(), 1)
    },
    {
      id: 2,
      name: "testing event 2",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
    },
    {
      id: 3,
      name: "testing event 3",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
    },
    {
      id: 4,
      name: "testing event 4",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
    },
    {
      id: 5,
      name: "testing event 5",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
    }
  ]
};
