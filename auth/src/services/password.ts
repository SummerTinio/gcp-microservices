import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

class Password {
  // static methods === available methods on the class itself (not on an instance)
  static async toHash(plaintextPassword: string) { // Password.toHash()
    const salt = randomBytes(8).toString('hex');

    // buffer === hashed password in hex buffer form
    const buf = (await scryptAsync(plaintextPassword, salt, 64)) as Buffer;
    const hashedPassword = buf.toString('hex');
    return `${hashedPassword}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) { // Password.compare()
    const [hash, salt] = storedPassword.split('.'); // split by . to undo concatenation

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    const hashedSupplied = buf.toString('hex');
    // will return true if hashed supplied password === hashed password from db
    return hashedSupplied === hash;
  }
}

export default Password;
