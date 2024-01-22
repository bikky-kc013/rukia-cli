type Person = {
    name: string;
    age: number;
    address: string;
  };
  
  type PersonWithoutName = Omit<Person, 'name'>;
  
  const person: Person = {
    name: 'John',
    age: 30,
    address: '123 Main St',
  };
  
  const personWithoutName: PersonWithoutName = {
    age: person.age,
    address: person.address,
  };
  
  console.log(personWithoutName);
  