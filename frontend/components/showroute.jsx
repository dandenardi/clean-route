import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button
} from "@nextui-org/react";

function ShowRoute() {


    const { isOpen, onOpen, onClose } = useDisclosure();
    const [route, setRoute] = useState([]);

    useEffect(() => {
        if (isOpen) {
            getRoute();
        }

    }, [isOpen]);

    async function getRoute() {
        try {
            const response = await axios.get('http://localhost:3000/rota-mais-curta');
            console.log(response.data);
            setRoute(response.data.rota)
        } catch (error) {
            console.error(error);

        }
    }


    return (
        <>
            <Button onClick={onOpen}>Gerar rota mais curta</Button>
            <Modal
                size="md"
                isOpen={isOpen}
                onClose={onClose}
            >

                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Rota mais curta!</ModalHeader>
                            <ModalBody>
                                <ul>
                                    {route.map((client, index) => (
                                        <li key={index}>{`Cliente ${client}`}</li>
                                    ))}
                                </ul>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Fechar
                                </Button>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>

            </Modal>
        </>
    )
}

export default ShowRoute