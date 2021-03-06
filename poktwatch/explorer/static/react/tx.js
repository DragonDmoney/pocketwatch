let txs = window.transactions;


function Failed(props) {
  console.log('test')
  if (props.code!=0 && props.code!=-1) {
    console.log("failed code")
    return (<span className="text-danger" data-toggle="tooltip" data-placement="bottom" title="" data-original-title={"Error in Txn: "+props.code}><strong><i className="fa fa-exclamation-circle"></i></strong></span>);
  }
  else {
    return <span/>
  }
}

function Hash(props) {
  return (
  <td>
    <Failed code={props.code} />
    <span className="hash-tag text-truncate myFnExpandBox_searchVal">
      <a href={"/tx/"+props.hash}>{props.hash}</a>
    </span>
  </td>);
}

function Method(props) {
  return (
  <td>
    <span style={{minWidth: "68px"}} className="u-label u-label--xs u-label--info rounded text-dark text-center font" data-toggle="tooltip" data-boundary="viewport" data-html="true" title="Transfer">{props.type}</span>
  </td>);
}

function Block(props) {
  let returnHeight = 0
  if (props.height==-1) {
    returnHeight= "(pending)"
  }
  else {
    returnHeight = props.height
  }
  return (
  <td>
    <i>{returnHeight}</i>
  </td>);
}

function Sender(props) {
  if (props.type == "claim") {
    return (
      <td>
        <span className="hash-tag text-truncate" data-toggle="tooltip" data-placement="bottom" data-placement="bottom" title="Relay reward from POKT network">POKT Network</span>
      </td>
    );
  }
  else {
    return (
      <td>

        <span style={{whiteSpace: "nowrap"}}>
          <a className="hash-tag text-truncate" href={"/address/"+props.sender} data-boundary="viewport" data-html="true" data-toggle="tooltip" data-placement="bottom" title="">{props.sender}</a>
        </span>
      </td>
    )
  }
}


function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function Age(props) {
	let a = new Date(props.time)
  a.setHours(a.getHours()-6)
  console.log(a)
	return (
		<td className="showAge "><span rel="tooltip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="{props.time}">{moment(a).fromNow()}</span></td>
	)

}

function Direction(props) {
  if (props.receiver==props.address || props.type=="claim") {
    return (
      <td>
        <span className="u-label u-label--xs u-label--success color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;IN&nbsp;</span>
      </td>
    );
  }
  else {
    // console.log(props.type)
    return (
      <td>
      <span className="u-label u-label--xs u-label--warning color-strong text-uppercase text-center w-100 rounded text-nowrap">&nbsp;OUT&nbsp;</span>
      </td>
    );
  }
}

function Receiver(props) {
  return (
    <td>
      <span style={{whiteSpace: "nowrap"}}>
        <a className="hash-tag text-truncate" href={"/address/"+props.receiver} data-boundary="viewport" data-html="true" data-toggle="tooltip" data-placement="bottom" title="{props.receiver}">{props.receiver}</a>
      </span>
    </td>
  );
};

function Value(props) {
  return (
    <td>
      <span data-toggle="tooltip" title="0 Pokt">{Math.round(props.value/10000)/100} Pokt</span>
    </td>
  );
};

function Transaction(props) {
  let classnm =""
  if (props.height== -1) {
    classnm="text-secondary font-italic"
  }
  return (
    <tr className={classnm}>
      <td>
        <a role="button" tabIndex="0" type="button" className="js-txnAdditional-1 btn btn-xs btn-icon btn-soft-secondary myFnExpandBox">
          <i className="far fa-eye btn-icon__inner"></i>
        </a>
      </td>
      <Hash hash={props.hash} code={props.code}/>
      <Method type={props.type} />
      <Block height={props.height} />
      <Age time={props.time} />
      <Sender type={props.type} sender={props.sender} />
      <Direction receiver={props.receiver} address={props.address} type={props.type} />
      <Receiver receiver={props.receiver} />
      <Value value={props.value} />
    </tr>
  );
}

function Transactions() {
  return (
      txs.map((value,index) => {
        return <Transaction hash={value.fields.hash} type={value.fields.type} height={value.fields.height} time={value.fields.timestamp} sender={value.fields.sender} address={window.address} receiver={value.fields.receiver} value={value.fields.value} code={value.fields.code} />;
      })
  );
}


ReactDOM.render(
  <Transactions />,
  document.querySelector("#transaction-list")
)
