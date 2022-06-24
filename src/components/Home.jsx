import {ethers} from "ethers";
import WalletBalance from "./WalletBalance";
import {useState, useEffect } from "react";

import BoredMillennials from "/artifacts/contracts/MyNft.sol/BoredMillennials.json";

const contractAddress = "0x2c740ae70A20Ac756856ce20e90a337E8c98E8Ea";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, BoredMillennials.abi, signer);


function Home(){
    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
        getCount();
        }, []);

    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    }
    return (
        <div>
            <WalletBalance />

            <h1>Bored Millennials NFT Collection</h1>
            <h2>Total Minted: {totalMinted}</h2>
            {Array (totalMinted + 1)
            .fill(0)
            .map((_, i) => (
                <div key={i}>
                 <NFTImage tokenID={i} />
                </div> 
            ))} 
        </div>
    );
}

function NFTImage({tokenID, getCount}){
    const contentId = 'QmafcjabZpwjpvTKuR2LQPA5hir7hi5bLAEf1Red4bSWLG'
    const metaDataURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenID}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenID}.png`;

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metaDataURI);
        console.log(result)
        setIsMinted(result);
    };

    const mintToken = async () => {
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts'
        });
        const addr = accounts[0];
        const result = await contract.payToMint(addr, metaDataURI, {value: ethers.utils.parseEther('0.05')});
        await result.wait();
        getMintedStatus();
    };

    async function getURI(){
        const uri =await contract.tokenURI(tokenID);
        console.log(uri);
    }

    return (
        <div>
            <img src = {isMinted ? imageURI : "https://via.placeholder.com/150"} />
            <div>
                <h5>ID #{tokenID}</h5>
                {!isMinted ? (
                    <button onClick={mintToken}>Mint</button>
                ) : (
                    <button onClick={getURI}>Taken! Show URI</button>
                )
                }
            </div>
        </div>
    );
}

export default Home;