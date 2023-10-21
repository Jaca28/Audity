export const checkChain = async () => {
    if (window.ethereum) {
        try {
            // check if the chain to connect to is installed
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal numbers
            });
        } catch (error) {
            // This error code indicates that the chain has not been added to MetaMask
            // if it is not, then install it into the user MetaMask
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x13881',
                                chainName: 'Polygon Mumbai Testnet',
                                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                                nativeCurrency: {
                                    name: "Mumbai Matic",
                                    symbol: "MATIC",
                                    decimals: 18
                                },
                                blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                            },
                        ],
                    });
                } catch (addError) {
                    console.error(addError);
                }
            }
            console.error(error);
        }
    } else {
        // if no window.ethereum then MetaMask is not installed
        alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    }
}