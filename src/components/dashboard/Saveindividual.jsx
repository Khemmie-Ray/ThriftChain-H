import React, { useCallback, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { coreTestnet2 } from "@reown/appkit/networks";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../../constants/singlethriftAbi.json";
import useSignerOrProvider from "../../hooks/useSignerOrProvider";
import { Contract, ethers } from "ethers";
import ButtonSpinner from "../loaders/ButtonSpinner";

const Saveindividual = ({ thriftAddress }) => {
  const { chainId } = useAppKitNetwork();
  const { address } = useAppKitAccount();
  const errorDecoder = ErrorDecoder.create([abi]);
  const { signer } = useSignerOrProvider();
  const [userAdd, setUserAdd] = useState(address);
  const [loading, setLoading] = useState(false)

  const contract = new ethers.Contract(thriftAddress, abi, signer);

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

    if (Number(chainId) !== Number(coreTestnet2.id)) {
      toast.error("You're not connected to Core Testnet2");
      return;
    }

    try {
      setLoading(true)

      const tx = await contract.saveForGoal(userAdd);
      console.log(tx);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success("Saved successfully");
      } else {
        toast.error("Save failed");
      }
    } catch (err) {
      const decodedError = await errorDecoder.decode(err);
      toast.error(`Savings failed - ${decodedError.reason}`, {
        position: "top-center",
      });
    } finally {
        setLoading(false)
    }
  }, [contract, address, chainId]);

  return (
    <>
        <input
          type="text"
          placeholder="Enter User address"
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
