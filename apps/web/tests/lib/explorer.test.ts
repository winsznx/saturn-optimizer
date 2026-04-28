import { describe, it, expect } from "vitest";
import {
  buildAddressLink,
  buildBlockLink,
  buildContractLink,
  buildMempoolLink,
  buildTxLink,
} from "../../src/lib/explorer";

const DEPLOYER = "SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV";
const TX = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

describe("explorer URL builders", () => {
  it("buildTxLink defaults to active network and points at /txid", () => {
    const url = buildTxLink(TX);
    expect(url).toContain("/txid/");
    expect(url).toContain(TX);
    expect(url).toMatch(/chain=(mainnet|testnet)/);
  });

  it("buildTxLink honours explicit chain override", () => {
    expect(buildTxLink(TX, "testnet")).toContain("chain=testnet");
  });

  it("buildAddressLink targets /address/", () => {
    expect(buildAddressLink(DEPLOYER)).toContain(`/address/${DEPLOYER}`);
  });

  it("buildContractLink concatenates address and name with a dot", () => {
    const url = buildContractLink(DEPLOYER, "saturn-vault");
    expect(url).toContain(`${DEPLOYER}.saturn-vault`);
  });

  it("buildBlockLink uses /block/ path", () => {
    expect(buildBlockLink(123456)).toContain("/block/123456");
  });

  it("buildMempoolLink uses /mempool path", () => {
    expect(buildMempoolLink()).toContain("/mempool");
  });
});
