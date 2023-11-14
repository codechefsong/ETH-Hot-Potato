import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const MatchRoom: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { id } = router.query;

  const { data: matchData } = useScaffoldContractRead({
    contractName: "ETHHotPotato",
    functionName: "getMatcheByID",
    args: [id as any],
  });

  const { data: players } = useScaffoldContractRead({
    contractName: "ETHHotPotato",
    functionName: "getPlayersByMatchID",
    args: [id as any],
  });

  const { data: blockTime } = useScaffoldContractRead({
    contractName: "ETHHotPotato",
    functionName: "getBlockTime",
  });

  const { writeAsync: passPotato } = useScaffoldContractWrite({
    contractName: "ETHHotPotato",
    functionName: "passPotato",
    args: [id as any],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "ETHHotPotato",
    eventName: "PlayerEliminateEvent",
    listener: (data: any) => {
      console.log(data[0].args);
      if (data[0].args.player === address) notification.error(`You been eliminated`);
    },
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-7">
      <div className="px-5">
        <h1 className="text-center mb-5">
          <span className="block text-2xl mb-2">Match #{matchData?.id.toString()}</span>
        </h1>

        <p>Current Position: {matchData?.currentPosition.toString()}</p>
        <p className="mb-0 font-bold">Players:</p>
        {players?.map((p, index) => (
          <div key={index} className="flex">
            <Address address={p} />
            {matchData?.currentPosition.toString() === index.toString() && <p className="ml-2">Current</p>}
          </div>
        ))}
        <p>Game Over: {matchData?.isFinish ? "Yes" : "No"}</p>
        <p>Current Time: {blockTime?.toString()}</p>
        <p>Deadline: {matchData?.blocknumber?.toString()}</p>

        <button
          className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={() => passPotato()}
        >
          Pass
        </button>
        <button
          className="py-2 px-16 mb-1 mt-3 bg-gray-300 rounded baseline hover:bg-gray-200 disabled:opacity-50"
          onClick={() => router.push("/lobby")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MatchRoom;
