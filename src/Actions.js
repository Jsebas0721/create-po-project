function Actions() {

  function deleteRecord(){
    console.log("DELETED");
    fetch("http://10.1.0.25:3009/delete", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    }).then((response) => {
      if (response.ok) {
      }
    });
  };

  return (
    <div className="action-buttons">
      <button className="action-button create">CREATE PO REQ</button>
      <button className="action-button submit"> SUBMIT PO</button>
      <button onClick={deleteRecord} className="action-button delete">DELETE PO REQ</button>
    </div>
  );
}

export default Actions;
