import { useEffect, useState } from "react";
import "./InformasiSaldo.css";
import getBalanceInquiry from "../services/api";

function InformasiSaldo() {
  const [data, setData] = useState("");
  const [buttonState, setButtonState] = useState("inactive");

  useEffect(() => {
    getBalanceInquiry()
      .then((data) => {
        console.log("Balance Inquiry:", data);
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleButtonState = () => {
    setButtonState((prevState) =>
      prevState === "active" ? "inactive" : "active"
    );
  };

  return (
    <>
      <section className="flex flex-col justify-center mx-32 ">
        <div className="flex flex-col justify-center items-center my-16">
          <h1>
            <strong>Informasi Saldo</strong>
          </h1>
          <p>Nama : {data.name}</p>
          <p>Account No : {data.accountNo}</p>
          <p>Partner Reference No : {data.partnerReferenceNo}</p>
        </div>
        <div>
          <button
            onClick={() => handleButtonState()}
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
          >
            Show Balance
          </button>
        </div>
      </section>
      <section>
        {buttonState === "active" &&
          data.accountInfos &&
          data.accountInfos.map((info, index) => (
            <div key={index} className="mx-32">
              <div className="my-8">
                <p>
                  <strong>Balance Type:</strong> {info.balanceType}
                </p>
                <p>
                  <strong>Status:</strong> {info.status}
                </p>
                <p>
                  <strong>Reg Status Code:</strong>{" "}
                  {info.registrationStatusCode}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Account Infos</th>
                      <th>Value</th>
                      <th>Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>Amount</td>
                      <td>{info.amount.value}</td>
                      <td>{info.amount.currency}</td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td>Float Amount</td>
                      <td>{info.floatAmount.value}</td>
                      <td>{info.floatAmount.currency}</td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td>Hold Amount</td>
                      <td>{info.holdAmount.value}</td>
                      <td>{info.holdAmount.currency}</td>
                    </tr>
                    <tr>
                      <th>4</th>
                      <td>Available Balance</td>
                      <td>{info.availableBalance.value}</td>
                      <td>{info.availableBalance.currency}</td>
                    </tr>
                    <tr>
                      <th>5</th>
                      <td>Ledger Balance</td>
                      <td>{info.ledgerBalance.value}</td>
                      <td>{info.ledgerBalance.currency}</td>
                    </tr>
                    <tr>
                      <th>6</th>
                      <td>Current Multilateral Limit</td>
                      <td>{info.currentMultilateralLimit.value}</td>
                      <td>{info.currentMultilateralLimit.currency}</td>
                    </tr>
                    <tr>
                      <th>7</th>
                      <td>Hold Amount</td>
                      <td>{info.holdAmount.value}</td>
                      <td>{info.holdAmount.currency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}

export default InformasiSaldo;
