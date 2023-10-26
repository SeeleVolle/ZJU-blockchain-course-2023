import React, { useState, useEffect } from 'react'
import { Card, Space, Col, Row, Image } from 'antd';
import {borrowyoucarContract, nftContract, erc20Contract, web3} from "../../utils/contracts";

const imageMapping = {
    '../../assets/car_1.jpg': require('../../assets/car_1.jpg'),
    '../../assets/car_2.jpg': require('../../assets/car_2.jpg'),
    '../../assets/car_3.jpg': require('../../assets/car_3.jpg'),
    '../../assets/car_4.jpg': require('../../assets/car_4.jpg'),
    '../../assets/car_5.jpg': require('../../assets/car_5.jpg'),
    '../../assets/car_6.jpg': require('../../assets/car_6.jpg'),
    '../../assets/car_7.jpg': require('../../assets/car_7.jpg'),
    '../../assets/car_8.jpg': require('../../assets/car_8.jpg'),
  };

export default function CarOwnedPage () {
    const [username, setUsername] = useState('');
    const [userbalance, setUserbalance] = useState('');
    const [IsLogined, setIsLogined] = useState<boolean>(false);
    const [userOwnedCars, setUserOwnedCars] = useState<string[]>([]);
    const [carReady, setCarReady] = useState<boolean>(false);

   
    // const [Is]IsLogined = username != null;
    useEffect(() => { 
        const handleUserLoggedIn = () => {
            const storedUser = sessionStorage.getItem('username');
            const storedBalance = sessionStorage.getItem('userbalance');
            // console.log(borrowyoucarContract.options);
            const totalcars_p = nftContract.methods.totalItems().call();

            const balance: string = storedBalance !== null ? storedBalance : '';
            const user: string = storedUser !== null ? storedUser : '';

            const ownedcars : any[] = [];
            totalcars_p.then((results : string[]) =>{
                const ownerPromises = results.map((tokenId) => nftContract.methods.ownerOf(tokenId).call());
                const userPromises = results.map((tokenId) => nftContract.methods.userof(tokenId).call());
                return Promise.all(ownerPromises.concat(userPromises)).then((ownersAndUsers) => {
                    for (let i = 0; i < results.length; i++) {
                        const owner : string = ownersAndUsers[i].toLowerCase();
                        const user : string = ownersAndUsers[i + results.length].toLowerCase();
                        if (storedUser == user || storedUser == owner) {
                          ownedcars.push({id: 'car_' + results[i], path: '../../assets/car_'+ results[i] +'.jpg'});
                        }
                      }
                    setUserOwnedCars(ownedcars);
                    setCarReady(true);
                    });
                }).catch((error: any) => {
                    console.error('Error in totalcars_p:', error);
            });
            // console.log(userOwnedCars)
            // console.log(carReady)
            // web3.eth.estimateGas(borrowyoucarContract.methods.Getcarlist().call()).then(console.log);
            if (storedUser) {
              setUsername(storedUser);
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

    }, [])

    
    return (
        <div>
            {IsLogined ? (carReady ? (
                <CarOwnedInformation IsLogined={IsLogined} cars={userOwnedCars} />
            ) : (
                <p>Loading data...</p>
            )):
            (<h3>Please connect your wallet first</h3>)
            }
        </div>
    );
}

function CarOwnedInformation({IsLogined, cars} : {IsLogined: boolean, cars: any[]})
{
   
    if(cars.length > 0){
        return (
            <div>
                 <Carlist products={cars} ></Carlist>
            </div>
        )
    }
    else{
        return (
            <div>
                <h2>No Cars Owned</h2>
            </div>
        )
    }
}

function Carlist({products}: {products: any[]}){
        const listItems = products.map(product =>
        <Col span={6}>
            <Card 
            title={product.id} 
            style={{ 
                width: 230,
                marginTop: '20px'
            }}
            bordered={false} 
            hoverable={true}
            cover={<img alt="example" width="75%" height="10%" src={imageMapping[product.path as keyof typeof imageMapping]} />}
            // cover={<img alt="example" width="75%" src="../../assets/car.png" />}
            >
            </Card>
        </Col>
      );
      
      return (
        <div>
            <Row gutter={8}>
                {listItems}
            </Row>
        </div>
      );
}