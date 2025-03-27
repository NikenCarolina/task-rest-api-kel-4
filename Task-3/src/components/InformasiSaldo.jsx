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
      <section className="flex flex-col justify-center px-4 sm:px-8 lg:px-32">
        <div className="flex flex-col justify-center md:items-center my-8 sm:my-12 lg:my-16">
          <h1 className="text-lg sm:text-xl lg:text-2xl">
            <strong>Informasi Saldo</strong>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg">Name : {data.name}</p>
          <p className="text-sm sm:text-base lg:text-lg">
            Account No : {data.accountNo}
          </p>
          <p className="text-sm sm:text-base lg:text-lg">
            Partner Reference No : {data.partnerReferenceNo}
          </p>
        </div>
        <div className="flex">
          <button
            onClick={() => handleButtonState()}
            className="btn btn-soft btn-md lg:btn-lg xl:btn-xl"
          >
            Show Balance
          </button>
        </div>
        <div className="divider"></div>
      </section>
      <section>
        {buttonState === "active" &&
          data.accountInfos &&
          data.accountInfos.map((info, index) => (
            <div key={index} className="px-4 sm:px-8 lg:px-32">
              <div className="my-4 sm:my-6 lg:my-8">
                <p className="text-sm sm:text-base lg:text-lg">
                  <strong>Balance Type:</strong> {info.balanceType}
                </p>
                <p className="text-sm sm:text-base lg:text-lg">
                  <strong>Status:</strong> {info.status}
                </p>
                <p className="text-sm sm:text-base lg:text-lg">
                  <strong>Reg Status Code:</strong>{" "}
                  {info.registrationStatusCode}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-auto w-full text-sm sm:text-base">
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
