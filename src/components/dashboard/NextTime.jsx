import React, { useCallback, useEffect, useRef, useState } from "react";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../../constants/singlethriftAbi.json";
import useSignerOrProvider from "../../hooks/useSignerOrProvider";
import { ethers } from "ethers";
import { getReadableDate } from "../shared/Reuse";

const NextTime = ({ thriftAddress, end }) => {
  const { signer } = useSignerOrProvider();
  const errorDecoder = ErrorDecoder.create([abi]);

  const [countdown, setCountdown] = useState("");
  const [nextTime, setNextTime] = useState(null);
  const stoppedRef = useRef(false);
  const [bufferSec, setBufferSec] = useState(0);
  const [periodPaid, setPeriodPaid] = useState(false);

  const contract = useCallback(() => {
    return new ethers.Contract(thriftAddress, abi, signer);
  }, [thriftAddress, signer]);

  const handleFetchTime = useCallback(async () => {
    try {
      // Fetch nextSavingTime (returns start of current period and currentPeriod)
      const tx = await contract().nextSavingTime();
      let nextTimestamp = Number(tx[0]);
      const currentPeriod = Number(tx[1]);

      // get buffer value (allowed window length)
      const buf = Number(await contract().buffer());
      setBufferSec(buf);

      // Fetch goal details to calculate the period duration and last saved time
      const goal = await contract().getIndividualGoal();
      const goalAmount = goal[4];
      const startTime = Number(goal[8]);
      const endTime = Number(goal[9]);
      const savingFrequency = Number(goal[11]);
      const lasttimeSaved = Number(goal[10]);

      // calculateSavingsSchedule returns (totalPeriods, amountPerPeriod, periodDuration)
      const schedule = await contract().calculateSavingsSchedule(
        goalAmount,
        startTime,
        endTime,
        savingFrequency
      );
      const periodDuration = Number(schedule[2]);

      const now = Math.floor(Date.now() / 1000);

      // Determine if current period has been paid by checking lasttimeSaved
      // If lasttimeSaved falls within the current period window, consider it paid.
      const paid = lasttimeSaved >= nextTimestamp && lasttimeSaved <= nextTimestamp + buf;
      setPeriodPaid(paid);

      // If we're within the allowed window (nextTimestamp .. nextTimestamp+buffer)
      // and the period hasn't been paid, display the current period (even if nextTimestamp <= now)
      if (now >= nextTimestamp && now <= nextTimestamp + buf && !paid) {
        setNextTime(nextTimestamp);
        return;
      }

      // Otherwise, advance nextTimestamp forward until it's in the future
      // (skip past paid or expired periods)
      let candidate = nextTimestamp;
      // Safety: avoid infinite loops if periodDuration is 0
      if (periodDuration <= 0) {
        setNextTime(nextTimestamp);
        return;
      }
      // advance until candidate is in the future and not already paid
      while (candidate + buf <= now || (lasttimeSaved >= candidate && lasttimeSaved <= candidate + buf)) {
        candidate += periodDuration;
        // prevent runaway loops; break if candidate goes far into future (> 10 years)
        if (candidate - now > 10 * 365 * 24 * 3600) break;
      }

      setNextTime(candidate);
    } catch (err) {
      console.log("Contract error:", err);
    }
  }, [contract]);

  useEffect(() => {
    // initial fetch
    handleFetchTime();
  }, [handleFetchTime]);

  useEffect(() => {
    if (!nextTime) return;

    const interval = setInterval(async () => {
      if (stoppedRef.current) return;

      const now = Math.floor(Date.now() / 1000);
      const remaining = nextTime - now;

      if (remaining <= 0) {
        const now = Math.floor(Date.now() / 1000);
        // If we're still within the buffer window and the period hasn't been paid,
        // show 'Due now!' and don't advance. Otherwise refetch/advance.
        if (bufferSec && now <= nextTime + bufferSec && !periodPaid) {
          setCountdown("Due now!");
          return;
        }

        // Otherwise, fetch the next period (either expired or already paid)
        try {
          await handleFetchTime();
        } catch (e) {
          console.error("Failed to refetch nextSavingTime:", e);
        }
        return;
      }

      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextTime, handleFetchTime]);

  return (
    <div className="bg-white text-primary border border-gray-200 rounded-full py-2 px-4 shadow-sm text-sm font-medium text-center">
      {countdown ? (
        <>
          Next saving: <span className="font-semibold">{countdown}</span>
        </>
      ) : (
        "Fetching next saving time..."
      )}
    </div>
  );
};

export default NextTime;