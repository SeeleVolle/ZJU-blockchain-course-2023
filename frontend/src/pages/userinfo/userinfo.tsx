import React, { useState, useEffect } from 'react'
import { Card, Space, Button } from 'antd';
import {borrowyoucarContract, nftContract, erc20Contract, web3} from "../../utils/contracts";
import './userinfo.css'

export default function UserInfoPage () {
    
    const [username, setUsername] = useState('');
    const [userbalance, setUserbalance] = useState('');
    const [IsLogined, setIsLogined] = useState<boolean>(false);
    // const [Is]IsLogined = username != null;
    useEffect(() => { 
        const handleUserLoggedIn = () => {
            const storedUser = sessionStorage.getItem('username');
            const storedBalance = sessionStorage.getItem('userbalance');
            // console.log(storedBalance);
            const balance: string = storedBalance !== null ? storedBalance : '';
            const user: string = storedUser !== null ? storedUser : '';
            if (user !== '') {
              setUsername(user);
              setUserbalance(balance);
              setIsLogined(true);
            }
         
        }

        const handleUserLoggedOut = () => {
            setUsername('');
            setUserbalance('');
            setIsLogined(false);
        }
        window.addEventListener('userLoggedIn', handleUserLoggedIn);
        window.addEventListener('userLoggedOut', handleUserLoggedOut);

        return () => {
            window.removeEventListener('userLoggedIn', handleUserLoggedIn);
            window.removeEventListener('userLoggedOut', handleUserLoggedOut);
        };

    }, [userbalance, IsLogined])

    return (
        <div className='UserInformation' style={{height: "100%"}}>
            {IsLogined ? (<UserInformation IsLogined={IsLogined} username={username} userbalance={userbalance}/>) : (<h3>Please connect your wallet first</h3>)}
        </div>
    )
   
}

function UserInformation({IsLogined, username, userbalance} : {IsLogined: boolean, username: string, userbalance: string}){
    // console.log(username)
    const onClickGetCar = async() => {
        if(nftContract){
            try{
                // console.log(username);
                await nftContract.methods.AddItem().send({
                    from: username
                });
                await nftContract.methods.AwardItem().send({
                    from: username
                });
                // await borrowyoucarContract.methods.mintMoney().send({
                //     from: username
                // });
                alert("You have claimed car");
            } catch(error:any){
                console.log(error)
                alert(error.message);
            }
           
        }
    }

    const onClickGetMoney = async() => {
        console.log(username)
        if(erc20Contract){
            try{
                await erc20Contract.methods.mint().send({
                    from: username
                });
                alert("You have claimed money");
            } catch(error:any){
                console.log(error)
                alert(error.message);
            }
           
        }
    }

    return (
        <div>
            <Space direction="vertical" size={20}>
            <Card title="Information" style={{ width: 350, overflow: 'auto'}}>
                <h3>Username:</h3>
                <p>{username}</p>
                <h3>Balance:</h3>
                <p>{userbalance}</p>   
            </Card>
            </Space>
            <Space direction='vertical' size={20}>
                <Button type="dashed" style={{marginLeft: '30px', marginTop: '2px'}} onClick={onClickGetCar}>GetYourOwnCar</Button>
                <Button type="dashed" style={{marginLeft: '30px', marginTop: '2px'}} onClick={onClickGetMoney}>GetMoney</Button>
            </Space>
        </div>
    )
}