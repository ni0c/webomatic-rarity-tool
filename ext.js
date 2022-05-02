$(function() {

	$("#mm-conn .cmenu-action-button-textwrap").click(function() {
		retrieveMMWallet();

	});

	checkMMstate();

});


function retrieveWallet(wallet)
{
	
	$("#wal").val(wallet);
	$("#wal_a").val(wallet);
	console.log("submit");
	//$("#walform").submit();

}

function setMMconnected()
{
	localStorage.setItem('mm_conn', true);
}

function isMMconnected()
{
	return (localStorage.getItem('mm_conn') === true);
}

async function resolveMMWallet()
{
	if (typeof web3 !== 'undefined') 
	{
		const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
		// Prompt user for account connections

		await provider.send("eth_requestAccounts", []);
		const signer = provider.getSigner();
		const addr = await signer.getAddress();
		console.log("Account:" + addr);
		localStorage.setItem('mmConnected', true);
		return addr;
	} 
	return null;
}

async function checkMMstate()
{
	if (isMMconnected() && typeof window.ethereum != "undefined")
	{
		let _wallet = await resolveMMWallet();
		if (_wallet !== null)
		{
			$("#mm-text").text("Metamask Connected");
		} else
		{
			$("#mm-text").text("Connect Metamask");
		}
	}
}


if (typeof window.ethereum != "undefined")
{
	window.ethereum.on('accountsChanged', function (accounts) {
  	checkMMstate();
	});
}


async function retrieveMMWallet()
{
	if (typeof web3 !== 'undefined') 
	{
		let addr = await resolveMMWallet();
		retrieveWallet(addr);
		alert("Wallet address retrieved and added to input.");
	} else
	{
		alert("Error! No Metamask detected!");
	}
}


function resolveEnsNameForAddress(address, _target)
{
	let query = `{ domains(where: {resolvedAddress: "${address}"}) { name } }`;

	//console.log(query);

	$.ajax({
		url: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
		contentType: "application/json",type:'POST',
		data: JSON.stringify({ "query": query, "variables": null }), 
		success: function(result) {
			//console.log(JSON.stringify(result));
			if (typeof result.data.domains[0] !== "undefined")
			{
				let name = result.data.domains[0].name;
				console.log(name);
				$(_target).val(name);
			} else
			{
				alert(".ETH name not found for this address or network is down.");
			}
		}
	});
}


function resolveEnsName(ensName, _target=null)
{
	let query = `{ domains(where: {name: "${ensName}"}) { resolvedAddress { id } } }`;

	//console.log(query);

	$.ajax({
		url: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
		contentType: "application/json",type:'POST',
		data: JSON.stringify({ "query": query, "variables": null }), 
		success: function(result) {
			//console.log(JSON.stringify(result));
			if (typeof result.data.domains[0] !== "undefined")
			{
				let hash = result.data.domains[0].resolvedAddress.id;
				console.log(hash);
				if (!_target)
				{
					retrieveWallet(hash);
				} else
				{
					$(_target).val(hash);
				}
			} else
			{
				alert(".ETH name not found or network is down.");
			}
		}
	});
}
