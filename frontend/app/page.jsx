"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterResults from '../components/filterresults';
import CreateUser from '../components/createuser';
import ShowRoute from '../components/showroute';

export default function Home() {

	const [clients, setClients] = useState([]);

	useEffect(() => {
		getClients();
	}, []);

	async function getClients() {
		try {
			const response = await axios.get('http://localhost:3000/clientes');
			console.log(response.data);
			setClients(response.data);
		} catch (error) {
			console.error("Um erro:", error);
		}
	}

	async function handleFilter(filteredClients) {
		setClients(filteredClients);
	}

	function handleAddClient(newClient) {
		setClients([...clients, newClient]);
		getClients();
	}


	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<h1>TudoLimpo - Sua parceira na Limpeza</h1>
			< FilterResults onFilter={handleFilter} />
			<ShowRoute />
			<section>
				{clients.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th>Nome</th>
								<th>E-mail</th>
								<th>Telefone</th>
								<th>Localização</th>
							</tr>
						</thead>
						<tbody>
							{clients.map((client) => (
								<tr key={client.id}>
									<td>{client.nome}</td>
									<td>{client.email}</td>
									<td>{client.telefone}</td>
									<td>x: {client.coordenada_x}, y: {client.coordenada_y}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : <p>Não existem clientes cadastrados com os critérios definidos...</p>}
			</section>

			<CreateUser onAdd={handleAddClient} />
		</section>
	);
}
