import React, { useCallback, useState } from "react";
import { Button } from "@headlessui/react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { hederaTestnet } from "@reown/appkit/networks";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../../constants/singlethriftAbi.json";
import tokenAbi from "../../constants/tokenAbi.json"
import useSignerOrProvider from "../../hooks/useSignerOrProvider";
import { ethers } from "ethers";
import ButtonSpinner from "../loaders/ButtonSpinner";

const Saveindividual = ({ thriftAddress, amount, onSaved }) => {
  const { chainId } = useAppKitNetwork();
  const { address } = useAppKitAccount();
  const errorDecoder = ErrorDecoder.create([abi]);
  const { signer } = useSignerOrProvider();
  const [loading, setLoading] = useState(false)

  const contract = new ethers.Contract(thriftAddress, abi, signer);
  const ercContract = new ethers.Contract(
    import.meta.env.VITE_TOKEN_ADDRESS,
    tokenAbi,
    signer
  );
  const userAdd = address.toLowerCase()

  const handleSaveFor = useCallback(async () => {
    if (!userAdd) {
      toast.error("Invalid Input");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!contract) {
      toast.error("Contract not found");
      return;
    }

    if (Number(chainId) !== Number(hederaTestnet.id)) {
      toast.error("You're not connected to Hedera testnet");
      return;
    }

    try {
      setLoading(true)

      const ercTx = await ercContract.approve(
        thriftAddress,
        ethers.parseUnits(amount, 18)
      );

      const rcp = await ercTx.wait()
      if (rcp.status) {
        toast.success("Approval successful!", {
          position: "top-center",
        });
      } else {
        toast.error("Approval failed!", {
          position: "top-center",
        });
      }

      const tx = await contract.saveForGoal(address);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success("Saved successfully");
        // If a parent supplied an onSaved callback, call it so they can re-fetch
        // otherwise reload the page to refresh data
        if (typeof onSaved === "function") {
          try {
            onSaved();
          } catch (e) {
            console.error("onSaved callback threw:", e);
            // still attempt a fallback reload
            window.location.reload();
          }
        } else {
          window.location.reload();
        }
      } else {
        toast.error("Save failed");
      }
    } catch (err) {
      const decodedError = await errorDecoder.decode(err);
      toast.error(`Savings failed - ${decodedError.reason}`, {
        position: "top-center",
      });
      console.log(err)
    } finally {
        setLoading(false)
    }
  }, [contract, address, chainId]);

  return (
    <>
        <input
          type="text"
          className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3 hidden"
          readOnly
          value={userAdd}
        />
          <Button
            className="bg-linear-to-r from-primary to-lilac py-3 px-8 rounded-full text-[14px] hover:scale-105 text-white mb-3 ml-4"
            onClick={handleSaveFor}
          >
            {!loading ? "Save" : <ButtonSpinner />}
          </Button>
    </>
  );
};

export default Saveindividual;
