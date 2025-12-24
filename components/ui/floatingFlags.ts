interface FloatingFlag {
  code: string;
  delay: number;
  className: string;
  hiddenOnMobile?: boolean;
}

export const floatingFlags: FloatingFlag[] = [
  { code: "US", delay: 0, className: "top-[10%] left-[5%] animate-float-1" },
  {
    code: "JP",
    delay: 2,
    className: "top-[20%] right-[10%] animate-float-2",
    hiddenOnMobile: true,
  },
  {
    code: "SK",
    delay: 3,
    className: "top-[5%] right-[8%] md:right-[25%] animate-float-2",
  },
  {
    code: "BR",
    delay: 4,
    className: "top-[65%] md:top-[20%] left-[40%] md:left-[15%] animate-float-1",
  },
  {
    code: "SE",
    delay: 6,
    className: "top-[12%] left-[58%] animate-float-2",
    hiddenOnMobile: true,
  },
  {
    code: "GB",
    delay: 5,
    className: "top-[40%] left-[25%] animate-float-3",
    hiddenOnMobile: true,
  },
  {
    code: "EE",
    delay: 4,
    className: "bottom-[20%] md:bottom-[15%] left-[10%] animate-float-3",
  },
  {
    code: "CA",
    delay: 2,
    className: "top-[30%] right-[25%] animate-float-2",
    hiddenOnMobile: true,
  },
  {
    code: "ZA",
    delay: 1,
    className: "bottom-[15%] md:bottom-[10%] right-[15%] md:right-[5%] animate-float-1",
  },
  {
    code: "NL",
    delay: 7,
    className: "bottom-[25%] right-[15%] animate-float-1",
    hiddenOnMobile: true,
  },
  {
    code: "CZ",
    delay: 9,
    className: "top-[15%] left-[35%] animate-float-2",
    hiddenOnMobile: true,
  },
];
