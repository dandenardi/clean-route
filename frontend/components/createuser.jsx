import React, { useState } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
    Input
} from "@nextui-org/react";

function CreateUser({ onAdd }) {


    const { isOpen, onOpen, onClose } = useDisclosure();


    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        x: null,
        y: null,
    });

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit() {

        try {
            const response = await axios.post('http://localhost:3000/clientes', formData);
            onAdd(response.data);
            onClose();
        } catch (error) {
            console.error("Erro ao adicionar cliente", error);
        }
    };


    return (
        <>
            <Button onClick={onOpen}>Adicionar Cliente</Button>
            <Modal
                size="md"
                isOpen={isOpen}
                onClose={onClose}
            >

                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Adicionar Novo Cliente</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    <Input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
                                    <Input type="text" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
                                    <Input type="text" name="telefone" placeholder="telefone" value={formData.telefone} onChange={handleChange} required />
                                    <Input type="number" name="x" placeholder="Coordernada X" value={formData.x} onChange={handleChange} required />
                                    <Input type="number" name="y" placeholder="Coordenada Y" value={formData.y} onChange={handleChange} required />
                                </form>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={onClose}>
                                    Fechar
                                </Button>
                                <Button color="primary" onPress={handleSubmit} >
                                    Incluir cliente
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>

            </Modal>
        </>
    )
}

export default CreateUser