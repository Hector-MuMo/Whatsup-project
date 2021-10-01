const auth = require('../../src/middlewares/auth.middleware');
const faker = require('faker');
const UserService = require('../../src/services/users.services');
const AuthService = require('../../src/services/auth.services');

describe('Validando la autenticación de usuarios', () => {
  let newUser = {},
    userCreated = {},
    userObj = {};

  beforeAll(async () => {
    //1. Crear un objeto de usuario con datos falsos y elegir una contraseña fija
    newUser = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'default1235',
      phone: faker.phone.phoneNumber('###-###-####'),
    };

    //2. Insertar el usuario en la base de datos
    userCreated = await UserService.create(newUser);

    //3. Iniciar sesión con el servicio login y
    //4. Guardar el token
    let token = await AuthService.login(userCreated.email, newUser.password);
  });

  afterAll(async () => {
    //5. Eliminar el usuario de la DB creado en el hook beforeAll
    let deleted = await UserService.delete(userCreated.id);
    //console.log(deleted);
  });

  it('Debería de obtener un token pasando como argumento un objeto de usuario', () => {
    //6. Crear la prueba para comprobar si genToken genera un token de verdad
    userCreated = JSON.parse(JSON.stringify(userCreated));

    let token = AuthService.genToken(userCreated);

    expect(token).toEqual(expect.any(String));
  });

  it('123Debería de obtener un token pasando un email y contraseña como argumento', async () => {
    //6.1 Crear la prueba para comprobar si el login devuelve verdadero
    let token = await AuthService.login(userCreated.email, newUser.password);

    expect(token).toEqual(expect.any(String));
  });

  it('Debería de obtener un falso al pasar un email y contraseña inexistente', async () => {
    //6.2 Crear la prueba para comprobar si el login devuelve verdadero

    await expect(() =>
      AuthService.login('prueba-error@gmail.com', 'error1235')
    ).rejects.toThrow();
  });

  it('Debería de llamar a la función next sin argumentos con un token valido', () => {
    //7. Crear la prueba para comprobar si el token es valido
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjQsImZpcnN0bmFtZSI6IkFkb2xmbyIsImxhc3RuYW1lIjoiUmFtaXJleiIsImVtYWlsIjoiYm9mbzEwMEBob3RtYWlsLmNvbSIsImlhdCI6MTYzMzEwOTQ3NSwiZXhwIjoxNjMzMTE2Njc1fQ.aJHsupPFVHuGmLs_3QRKzR81MFibmnE_gHeUaNsM0XI',
      },
    };

    const res = {};
    const next = jest.fn();
    //Token valido -> tiene el formato correcto y no ha expirado

    auth.validateToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    //console.log(next.mock.calls);
    expect(next.mock.calls[0][0]).toBeUndefined();
  });

  it('Debería de llamar a la función next con argumentos y un token invalido', () => {
    //8. Crear la prueba para comprobar si el token es invalido
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjQsImZpcnN0bmFtZSI6IkFkb2xmbyIsImxhc3RuYW1lIjoiUmFtaXJleiIsImVtYWlsIjoiYm9mbzEwMEBob3RtYWlsLmNvbSIsImlhdCI6MTYzMjg2MDc0MCwiZXhwIjoxNjMyODY3OTQwfQ._klPeoawOUa6eN-Um4roKDTDNR0nKkE24kqoA9ie0xYf',
      },
    };

    const res = {};
    const next = jest.fn();

    //Token valido -> tiene un formato incorrecto o ya ha expirado

    auth.validateToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    //validamos si el token es invalido o ha expirado
    const validation = (() => {
      if (
        next.mock.calls[0][0] === 'invalid signature' ||
        next.mock.calls[0][0] === 'jwt expired'
      ) {
        return true;
      }
    })();

    expect(validation).toBeTruthy();
    //console.log(typeof next.mock.calls[0][0]);
    expect(next.mock.calls[0][0]).toEqual(expect.any(String));
  });
});

//Los mocks se aplican principalmente cuando se hace una prueba a una función y esta nos devuelve otra función como resultado
