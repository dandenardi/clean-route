import React, { useState } from 'react'
import axios from 'axios';
import { Button } from '@nextui-org/button';
import { Input } from "@nextui-org/react";

function FilterResults({ onFilter }) {

    const [filterData, setFilterData] = useState({
        nome: "",
        email: "",
        telefone: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
    }

    async function handleFilter() {
        try {
            const response = await axios.get('http://localhost:3000/clientes/filtrar', {
                params: filterData,
            });
            onFilter(response.data);
            setFilterData({
                nome: "",
                email: "",
                telefone: "",
            })
        } catch (error) {
            console.log("Não foi possível filtrar:", error);
        }
    }

    return (
        <>
            <div className="filter-container">
                <Input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={filterData.nome}
                    onChange={handleChange}
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={filterData.email}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="telefone"
                    placeholder="Telefone"
                    value={filterData.telefone}
                    onChange={handleChange}
                />


            </div >
            <Button onClick={handleFilter}>Filtrar</Button>
        </>

    )
}

export default FilterResults