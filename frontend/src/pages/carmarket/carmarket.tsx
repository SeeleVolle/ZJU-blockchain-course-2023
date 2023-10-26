import React, { useState, useEffect } from 'react'
import { EditOutlined, UserSwitchOutlined, UserOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Card, Space, Col, Row, Image, Input, Button, Form} from 'antd';
import {borrowyoucarContract, nftContract, erc20Contract, web3} from "../../utils/contracts";

const { Meta } = Card;

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

export default function CarMarketPage () {

    const [username, setUsername] = useState('');
    const [userbalance, setUserbalance] = useState('');
    const [IsLogined, setIsLogined] = useState<boolean>(false);
    const [marketCars, setmarketCars] = useState<any[]>([]);
    const [carReady, setCarReady] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');
    const [freeCars, setFreeCars] = useState<any[]>([]);

    // const [Is]IsLogined = username != null;
    useEffect(() => { 
        const handleUserLoggedIn = () => {
            const storedUser = sessionStorage.getItem('username');
            const storedBalance = sessionStorage.getItem('userbalance');
            const storedfilter = sessionStorage.getItem('filter');
            // console.log(borrowyoucarContract.options);
            const totalcars_p = nftContract.methods.totalItems().call();

            const balance: string = storedBalance !== null ? storedBalance : '';
            const user: string = storedUser !== null ? storedUser : '';
            const filter: string = storedfilter !== null ? storedfilter : '';

            const marketCars : any[] = [];
            const freeCars : any[] = [];
            totalcars_p.then((results : string[]) =>{
                const userPromises = results.map((tokenId) => nftContract.methods.userof(tokenId).call());
                const ownerPromises = results.map((tokenId) => nftContract.methods.ownerOf(tokenId).call());
                const pricePromises = results.map((tokenId) => borrowyoucarContract.methods.getCarPrice(tokenId).call());
                return Promise.all(ownerPromises.concat(userPromises).concat(pricePromises)).then((ownersAndUsers) => {
                    for (let i = 0; i < results.length; i++) {
                        const owner : string = ownersAndUsers[i].toLowerCase();
                        const user : string = ownersAndUsers[i + results.length].toLowerCase();
                        const price : string = ownersAndUsers[i + results.length * 2];
                        if (user == '0' || user == '0x0000000000000000000000000000000000000000') {
                          freeCars.push({id: results[i], path: '../../assets/car_'+ results[i] +'.jpg', owner: owner, user: "None", price: '1'});
                          marketCars.push({id: results[i], path: '../../assets/car_'+ results[i] +'.jpg', owner: owner, user: "None", price: '1'});
                        }
                        else
                            marketCars.push({id: 'car_' + results[i], path: '../../assets/car_'+ results[i] +'.jpg', owner: owner, user: user, price: '1'});
                      }
                    setmarketCars(marketCars);
                    setFreeCars(freeCars);
                    setCarReady(true);
                    });
                }).catch((error: any) => {
                    console.error('Error in totalcars_p:', error);
            });
            // console.log(carReady)
            // web3.eth.estimateGas(borrowyoucarContract.methods.Getcarlist().call()).then(console.log);
            if (user) {
              setUsername(user);
              setUserbalance(balance);
              setIsLogined(true);
            }
            if(filter != null)
                setFilter(filter);

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
            {IsLogined ? (
                carReady ? (
                    filter == 'all' ? (<CarMarketInformation IsLogined={IsLogined} cars={marketCars} username={username} free={false}/>) 
                    : (<CarMarketInformation IsLogined={IsLogined} cars={freeCars} username={username} free={true}/>)
                    )          
                 : (
                    <p>Loading data...</p>
                )
            ) : (<h3>Please connect your wallet first</h3>)
            }
        </div>
    );
}



function CarMarketInformation({IsLogined, cars, username, free} : {IsLogined: boolean, cars: any[], username: string, free: boolean})
{
    if(IsLogined && cars.length > 0){
        return (
            <div>
                 <Carlist products={cars} username={username}></Carlist>
            </div>
        )
    }
    else if(free == false){
        return (
            <div>
                <h3>There is no car in the Market</h3>
            </div>
        );
    }
    else {
        return (
            <div>
                <h3>There is no free car in the Market</h3>
            </div>
        );
    }
}

function Carlist({products, username}: {products: any[], username: string}){

    const [form] = Form.useForm();
    const onClickBorrow = async({product} : {product: any}) => {
        const duration =form.getFieldValue('time'); 
        const owner : string = product.owner;
        const price : number = parseInt(product.price);
        const user : string = product.user;
        if(user != 'None')
        {
            alert("You cannot borrow a owned car");
        }
        else if(borrowyoucarContract){
            try{
                // await borrowyoucarContract.methods.borrowCar(username, product.id, duration).send({
                //     from: username
                // });
                
                await nftContract.methods.setUser(product.id, username, duration).send({
                    from: username
                });
                await nftContract.methods.transfer(product.id, username).send({
                    from: username
                });
                await erc20Contract.methods.new_transfer(username, owner, price * duration).send({
                    from: username
                })
            } catch(error:any){
                console.log(error)
                alert(error.message);
            }
        }
        
    }

    const onSubmit = (values: any) => {
        console.log(values)
    }

    const listItems = products.map(product =>
    <Col span={6}>
        <Card 
        style={{ 
            width: 230,
            marginTop: '20px'
        }}
        bordered={false} 
        hoverable={true}
        cover={<img alt="example" width="75%" height="10%" src={imageMapping[product.path as keyof typeof imageMapping]} />}
        >
        <div style={{
            maxWidth: '300px', // 适当设置最大宽度
            overflowX: 'auto', // 当内容溢出时显示垂直滚动条
        }}>
                <h3>Owner: <br/></h3>
                <p>{product.owner} <br/> </p>
                <h3>User: <br/></h3>
                <p>{product.user}</p>
                <h3>Price(erc/s):</h3>
                <p>{product.price}</p>
        </div>
        <div style={{marginTop:'20px', display: 'flex', alignItems: 'center' }}>
                <Form form={form} onFinish={onSubmit}>
                    <Form.Item name="time">
                        <Input placeholder="Time" prefix={<FieldTimeOutlined />} style={{width: '100px', left: '', marginRight: '10px'}}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" style={{width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'} } onClick={() => onClickBorrow({product,})}>确定</Button>
                    </Form.Item>
                </Form>
        </div>
        </Card>
    </Col>
    );
    
    return (
    <div style={{marginTop: '10px'}}>
        <Row gutter={8}>
            {listItems}
        </Row>
    </div>
    );
}