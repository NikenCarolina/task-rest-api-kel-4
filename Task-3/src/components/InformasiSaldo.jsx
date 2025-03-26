import { useEffect, useState } from "react";
import "./InformasiSaldo.css";
import getBalanceInquiry from "../services/api";

function InformasiSaldo() {
  const [data, setData] = useState("");

  useEffect(() => {
    getBalanceInquiry()
      .then((data) => {
        console.log("Balance Inquiry:", data);
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <>
      <section className="flex flex-col justify-center items-center mx-64 my-16">
        <h1 className="self-center">
          <strong>Informasi Saldo</strong>
        </h1>
        <p>Nama : {data.name}</p>
        <p>Account No : {data.accountNo}</p>
        <p>Partner Reference No : {data.partnerReferenceNo}</p>
      </section>
      <section>
        {data.accountInfos &&
          data.accountInfos.map((info, index) => (
            <div key={index} className="mb-8">
              <p>Balance Type: {info.balanceType}</p>
              <p>Status: {info.status}</p>
              <p>Reg Status Code: {info.registrationStatusCode}</p>
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
