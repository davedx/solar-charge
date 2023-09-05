import ping from "ping";
import dns from "node:dns/promises";
import log from "electron-log";
import os from "os";

function ipToBinary(ip: string) {
  return ip
    .split(".")
    .map((octet) => parseInt(octet, 10).toString(2).padStart(8, "0"))
    .join("");
}

// Convert binary form back to an IP address
function binaryToIp(binary: any) {
  return binary
    .match(/.{8}/g)
    .map((octet: any) => parseInt(octet, 2))
    .join(".");
}

function generateIPRange(ip: string, netmask: string) {
  const ipBinary = ipToBinary(ip);
  const netmaskBinary = ipToBinary(netmask) as any;

  // Calculate network address
  const networkBinary = ipBinary
    .slice(0, 32)
    .split("")
    .map((bit: any, i: any) => bit & netmaskBinary[i])
    .join("");

  const ips = [];
  const hostBits = 32 - netmaskBinary.replace(/0/g, "").length; // Count of host bits

  // Calculate the number of hosts in the subnet
  const numHosts = Math.pow(2, hostBits) - 2; // -2 to exclude network and broadcast addresses

  for (let i = 1; i <= numHosts; i++) {
    // Start from 1 to exclude the network address
    const hostPart = (parseInt(networkBinary, 2) + i)
      .toString(2)
      .padStart(32, "0");
    ips.push(binaryToIp(hostPart));
  }

  return ips;
}

function getFirstExternalIPv4() {
  const interfaces = os.networkInterfaces();

  for (const [interfaceName, interfaceInfo] of Object.entries(interfaces)) {
    for (const info of interfaceInfo) {
      if (info.family === "IPv4" && !info.internal) {
        return {
          interfaceName,
          ip: info.address,
          netmask: info.netmask,
        };
      }
    }
  }

  return null;
}

// Utility function to get hostname by IP
async function getHostname(ip: string) {
  try {
    const hostnames = await dns.reverse(ip);
    return hostnames[0];
  } catch (err) {
    return null;
  }
}

async function scanNetwork(ipRange: string[]) {
  const promises = [];
  for (const ip of ipRange) {
    const isAlive = ping.promise.probe(ip);
    promises.push(isAlive);
  }
  const results = await Promise.all(promises);
  const alive = results.filter((r) => r.alive);
  const hostPromises = [];
  // log.info(
  //   "alive:",
  //   alive.map((a) => a.host)
  // );
  for (const aliveIp of alive) {
    hostPromises.push(getHostname(aliveIp.host));
  }
  const hostResults = await Promise.all(hostPromises);
  //log.info("hostResults:", hostResults);
  let i = 0;
  const ipHostnames = [];
  for (const aliveIp of alive) {
    ipHostnames.push(`${aliveIp.host}:${hostResults[i]}`);
    i++;
  }
  return ipHostnames;
}

export const scanLocalNetwork = async () => {
  const networkInfo = getFirstExternalIPv4();

  if (networkInfo) {
    const { ip, netmask } = networkInfo;

    const ipRange = generateIPRange(ip, netmask);
    const ipHostnames = await scanNetwork(ipRange);
    return ipHostnames;
  }
  return [];
};
