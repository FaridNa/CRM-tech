import React, {useEffect, useState} from 'react';
import './SearchItems.css';


const SearchItems = ({value, type, func, focus, items}) => {
    const [readyItems, setReadyItems] = useState([]);

    useEffect(() => {
      if (value.length >= 1) {
        const filter = type === 'id'
        ? items.filter(el => (el.ObjectNumber+'').startsWith(value+''))
        : type === 'Name'
        ? items.filter(el => el.Name.toLowerCase().includes(value.toLowerCase()))
        : items.filter(el => el.Address.toLowerCase().includes(value.toLowerCase()));
        const sorted = filter.length > 50 ? filter : filter.sort((a, b) => a.ObjectNumber > b.ObjectNumber ? 1 : -1);
        setReadyItems(sorted);
      }
    }, [value, items]);


    return (
        <>

                {readyItems.length !== 0 ?
                    <ul className='search-items'>
                        {readyItems.map(el => <li key={el.ObjectNumber} onClick={() => {
                            func(el.ObjectNumber, el.Name, el.Address);
                            focus();
                        }}>
                          {type === 'id' ? `№ ${el.ObjectNumber}` : null}   
                          {type === 'Name' ? `${el.Name}` : null}
                          {type === 'Address' ? <div> <text> {el.Address} </text> <text> </text> <text style={{float: 'right'}}> {el.ObjectNumber + "             " + el.Name } </text> </div> : null}
                        </li>)}</ul> : null}

        </>

    );
}



export default SearchItems;
