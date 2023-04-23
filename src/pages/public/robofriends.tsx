/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useCallback, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "~/store/root.store";

import { setRobots, searchRobots } from "~/reducers/public.reducer";
import { getServerSession } from "next-auth";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { type Robot } from "~/types/robofriends.types";
import {
  RobofriendCardSkeleton,
  RobofriendProfileCardSkeleton,
} from "../robofriends";

const Robofriends = () => {
  const dispatch = useDispatch();
  const robots = useSelector((state: RootState) => state.publicStore.robots);
  const user = useSelector((state: RootState) => state.publicStore.user);
  const [currentRobots, setCurrentRobots] = useState<Robot[]>([]);

  const [userSearch, setUserSearch] = useState("");

  const handleSearchChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setUserSearch(target.value);
      dispatch(setRobots(robots || []));
      if (target.value) dispatch(searchRobots(target.value));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [robots]
  );

  return (
    <div className="grid max-h-screen grid-cols-4 gap-2">
      <div className="col-span-1 max-h-screen pt-5">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Search"
            value={userSearch}
            onChange={handleSearchChange}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="divider"></div>

        {currentRobots.length > 0 && user ? (
          <div className="flex flex-col items-center justify-center">
            <div className="avatar">
              <div
                className="w-24 rounded-full bg-secondary-content"
                // style={{ backgroundColor: randomColor() }}
              >
                <img
                  loading="lazy"
                  src={`https://robohash.org/${user.name}`}
                  alt={user.name || "robofriend-profile"}
                />
              </div>
            </div>

            <article className="prose flex flex-col items-center  justify-center text-center">
              <p className="mt-5 leading-tight">
                <strong>{user.name} </strong>
                <br />
                {user.email}
              </p>
            </article>
          </div>
        ) : (
          <RobofriendProfileCardSkeleton />
        )}
      </div>

      <div className="col-span-3 flex max-h-screen flex-wrap  gap-3  overflow-y-auto p-5  ">
        {currentRobots.length > 0 ? (
          robots.map((robot, index) => (
            <div
              key={`robocards-${index}`}
              className="h-75 card w-60 rounded-lg bg-secondary shadow-lg transition ease-in-out hover:-translate-y-1  hover:scale-105"
              // style={{ backgroundColor: randomColor() }}
            >
              <figure className="px-10 pt-10">
                <div className="avatar">
                  <div
                    className="w-24 rounded-full  bg-secondary-content"
                    // style={{ backgroundColor: randomColor() }}
                  >
                    <img
                      loading="lazy"
                      src={`https://robohash.org/${robot.name}`}
                      alt={robot.name || "robofriend-friend"}
                    />
                  </div>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{robot.name}</h2>
              </div>
            </div>
          ))
        ) : (
          <RobofriendCardSkeleton length={8} />
        )}
      </div>
    </div>
  );
};

export default Robofriends;

//* Documentation
//* https://next-auth.js.org/tutorials/securing-pages-and-api-routes#server-side
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/robofriends",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};