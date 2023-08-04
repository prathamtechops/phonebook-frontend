import { useState, useEffect } from "react";
import personServices from "./services/Persons";
import Notification from "./Notiffication";

const App = () => {
    const data = [];
    const [persons, setPersons] = useState(null);

    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [personAdded, setPersonAdded] = useState(false);

    useEffect(() => {
        personServices.getAll().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const newPerson = {
            name: newName,
            number: newNumber,
        };
        if (persons.some((person) => person.name === newName)) {
            if (
                window.confirm(
                    `${newName} is already added to phonebook, replace the old number with a new one?`
                )
            ) {
                const person = persons.find(
                    (person) => person.name === newName
                );
                personServices
                    .update(person.id, newPerson)
                    .then((returnedPerson) => {
                        setPersons(
                            persons.map((person) =>
                                person.id !== returnedPerson.id
                                    ? person
                                    : returnedPerson
                            )
                        );
                    });
            }

            return;
        }
        personServices.create(newPerson).then((returnedPerson) => {
            setPersonAdded(`${returnedPerson.name} added`);

            setTimeout(() => setPersonAdded(false), 5000);

            setPersons(persons.concat(returnedPerson));
        });

        setNewName("");
        setNewNumber("");
    };

    const filterPersons = (filter) => {
        const filteredPersons = persons.filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
        );
        setPersons(filteredPersons);
        if (filter === "") setPersons(data);
    };

    const deletePerson = (id) => {
        const person = persons.find((person) => person.id === id);
        if (window.confirm(`Delete ${person.name}?`)) {
            personServices.remove(id).then(() => {
                setPersons(persons.filter((person) => person.id !== id));
            });
        }
    };

    if (persons === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={personAdded} type="newperson" />
            <div>
                filter shown with{" "}
                <input onChange={(e) => filterPersons(e.target.value)} />
            </div>
            <form onSubmit={onSubmit}>
                <h3>Add a new</h3>
                <div>
                    name:{" "}
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>
                <div>
                    number:{" "}
                    <input
                        value={newNumber}
                        onChange={(e) => setNewNumber(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <div>
                {persons.map((person) => (
                    <div key={person.name}>
                        {person.name} {person.number}{" "}
                        <button onClick={() => deletePerson(person.id)}>
                            delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
