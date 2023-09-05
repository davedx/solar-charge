const INVERTERS = [
  {
    id: "omnik",
    hostname: "igen-wifi",
  },
];

export const findInverters = (netHosts: string[]) => {
  //console.log("netHosts:", netHosts);
  const results = INVERTERS.map((i) => {
    const match = netHosts.find(
      (nh) => nh.toLowerCase().indexOf(i.hostname.toLowerCase()) !== -1
    );
    return { id: i.id, match: match };
  }).filter((m) => m.match);
  return results;
};
