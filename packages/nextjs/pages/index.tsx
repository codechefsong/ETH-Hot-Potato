import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">ETH Hot Potato</span>
          </h1>
          <Image className="ml-8" alt="Game" width={500} height={350} src="/game.png" />
          <p className="text-center text-lg">Be the last player remaining without the hot potato when the game ends</p>
          <div className="flex justify-center mb-2">
            <Link
              href="/example-ui"
              passHref
              className=" py-2 px-16 mb-1 mt-3 bg-green-500 rounded baseline hover:bg-green-400 disabled:opacity-50"
            >
              Play
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="text-center">
          <h2 className="mt-3 text-4xl">Gameplay</h2>
        </div>
        <div className="flex justify-center">
          <ul className="list-disc" style={{ width: "600px" }}>
            <li>The game begins with one player holding the hot potato</li>
            <li>Players must pass the hot potato to the person next to them as quickly as possible</li>
            <li>
              The player holding the hot potato when a certain block height is reached is eliminated from the game
            </li>
            <li>The game continues with the remaining players until only one player is left</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
