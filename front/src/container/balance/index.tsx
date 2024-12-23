import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from "../../component/title";
import Subtitle from "../../component/subtitle";
import BackgroundBalance from "../../png/bg-small.png";
import SettingsButton from "../../svg/setting.svg";
import NotificationsButton from "../../svg/bell-white.svg";
import Transaction from "../../component/transaction";  
import ReceiveButton from "../../svg/arrow-down-right.svg";
import SendButton from "../../svg/people-upload.svg";
import FormLink from "../../component/form-link";
import Button from "../../component/button";
import { AuthContext } from '../../context/authContext';
import "./index.css";

const BalancePage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const response = await fetch('http://localhost:4000/balance', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authContext?.state.token}` },
        });
        
        if (!response.ok) {
          throw new Error('Не вдалося завантажити дані про баланс');
        }
  
        const data = await response.json();
        
        // Сортуємо транзакції у зворотному порядку за датою, щоб останні були зверху
        const sortedTransactions = data.transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
        setBalance(data.balance);
        setTransactions(sortedTransactions);
      } catch (err: any) {
        setError(err.message);
      }
    };
  
    fetchBalanceData();
  }, [authContext]);

  const handleTransactionClick = (transactionId: string) => {
    navigate(`/transaction/${transactionId}`);
  };

    // Додавання сповіщення при отриманні транзакцій
    const updateBalance = (newTransaction: any) => {
      const amount = newTransaction.amount;
      if (newTransaction.type === 'credit') {
        setBalance(prevBalance => prevBalance + amount);
        addBalanceNotification('balanceCredit', amount);
      } else if (newTransaction.type === 'debit') {
        setBalance(prevBalance => prevBalance - amount);
        addBalanceNotification('balanceDebit', amount);
      }
    };

  // Оновлення сповіщень після зміни балансу
  const addBalanceNotification = async (type: 'balanceCredit' | 'balanceDebit', amount: number) => {
    if (authContext) {
      // Додаємо локальне сповіщення
      authContext.dispatch({
        type: 'ADD_EVENT',
        payload: {
          type,
          time: new Date().toISOString(),
          amount,
        },
      });

      // Надсилаємо сповіщення на сервер
      try {
        const response = await fetch('http://localhost:4000/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authContext.state.token}`
          },
          body: JSON.stringify({
            userId: authContext.state.user.id,
            type,
            time: new Date().toISOString(),
            details: { amount: Math.abs(amount) }
          })
        });

        if (!response.ok) {
          throw new Error('Не вдалося зберегти сповіщення на сервері');
        }
      } catch (error) {
        console.error('Помилка при відправці сповіщення на сервер:', error);
      }
    } else {
      console.error("AuthContext is null");
    }
  };
  return (
    <section className="start balance"> 
      <img src={BackgroundBalance} alt="background" className="bgd-small" />
      
      <div className="head head__balance">     
        <div className="subhead">
          <FormLink linkHref="/settings" linkText={<img src={SettingsButton} alt="Settings" className="icon" />} />
          <Subtitle> <div className="subtitle__balance"> Main wallet</div> </Subtitle>
          <FormLink linkHref="/notifications" linkText={<img src={NotificationsButton} alt="Notifications" className="icon" />} />
        </div>

        <Title> 
          <div className="title__balance ">
            $ <span className="dollar">{`${balance}`}
              {/* <span className="cent">{`.00`}</span > */}
            </span> 
          </div>
        </Title>
      </div>

      <div className="buttons__wrapper">
        <button className="button__transaction" onClick={() => navigate("/receive")}>
          <img src={ReceiveButton} alt="Receive" className="icon icon__transaction" />
          <p>Receive</p>
        </button>

        <button className="button__transaction" onClick={() => navigate("/send")}>
          <img src={SendButton} alt="Send" className="icon icon__transaction" />
          <p>Send</p>
        </button>
      </div>

      <div className="transaction-history">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Button
              key={transaction.id}
              onClick={() => {
                handleTransactionClick(transaction.id);
                updateBalance(transaction); // Виклик оновлення балансу тільки при натисканні
              }}
              className="transaction-item"
            >
              <Transaction
                source={transaction.source}
                name={transaction.name || transaction.system}
                time={transaction.date}
                type={transaction.type === 'debit' ? 'Sending' : 'Receipt'}
                amount={transaction.amount}
                amountClass={transaction.type === 'credit' ? 'amount-credit' : 'amount-debit'}
              />
            </Button>
          ))
        ) : (
          <p>Транзакцій ще немає</p>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
};

export default BalancePage;



//---------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Title from "../../component/title";
// import Subtitle from "../../component/subtitle";
// import BackgroundBalance from "../../png/bg-small.png";
// import SettingsButton from "../../svg/setting.svg";
// import NotificationsButton from "../../svg/bell-white.svg";
// import Transaction from "../../component/transaction";  
// import ReceiveButton from "../../svg/arrow-down-right.svg";
// import SendButton from "../../svg/people-upload.svg";
// import FormLink from "../../component/form-link";
// import Button from "../../component/button"; 
// import "./index.css";

// const BalancePage: React.FC = () => {
//   const [balance, setBalance] = useState<number>(0);
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBalanceData = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/balance', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',            
//           },          
//         }
//       );
        
//         if (!response.ok) {
//           throw new Error('Не вдалося завантажити дані про баланс');
//         }

//         const data = await response.json();
//         console.log("Дані балансу:", data);
//         setBalance(data.balance);
//         setTransactions(data.transactions);
       
//       } catch (err: any) {
//         setError(err.message);
//       }
//     };

//     fetchBalanceData();
    
//   }, []);

//   // Функція для обробки кліка на транзакцію
//   const handleTransactionClick = (transactionId: string) => {
//     navigate(`/transaction/${transactionId}`); // Перенаправлення на сторінку транзакції
//   };

//   return (
//     <section className="start balance"> 
//       <img src={BackgroundBalance} alt="background" className="bgd-small" />
      
//       <div className="head head__balance">     
//         <div className="subhead">
//           <FormLink linkHref="/settings" linkText={<img src={SettingsButton} alt="Settings" className="icon" />} />
//           <Subtitle> <div className="subtitle__balance"> Main wallet</div> </Subtitle>
//           <FormLink linkHref="/notifications" linkText={<img src={NotificationsButton} alt="Notifications" className="icon" />} />
//         </div>

//         <Title> 
//           <div className="title__balance ">
//             $ <span className="dollar">{`${balance}`}<span className="cent">{`.00`}</span ></span> 
//           </div>
//         </Title>
//       </div>

//       <div className="buttons__wrapper">
//         <button className="button__transaction" onClick={() => navigate("/receive")}>
//           <img src={ReceiveButton} alt="Receive" className="icon icon__transaction" />
//           <p>Receive</p>
//         </button>

//         <button className="button__transaction" onClick={() => navigate("/send")}>
//           <img src={SendButton} alt="Send" className="icon icon__transaction" />
//           <p>Send</p>
//         </button>
//       </div>

//       <div className="transaction-history">
//   {transactions.length > 0 ? (
//     transactions.map((transaction) => (
//       <Button
//         key={transaction.id}
//         onClick={() => handleTransactionClick(transaction.id)}
//         className="transaction-item" // Вкажіть необхідний клас для стилів
//       >
//         <Transaction
//           logo={transaction.logo}
//           name={transaction.name || transaction.system}
//           time={transaction.date}
//           type={transaction.type === 'debit' ? 'Sending' : 'Receipt'}
//           amount={transaction.amount}
//           amountClass={transaction.type === 'credit' ? 'amount-credit' : 'amount-debit'}
//         />
//       </Button>
//           ))
//         ) : (
//           <p>Транзакцій ще немає</p>
//         )}
//       </div>

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </section>
//   );
// };

// export default BalancePage;




