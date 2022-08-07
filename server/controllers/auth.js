import { connect } from "getstream";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import StreamChatt from "stream-chat";

const StreamChat = StreamChatt.StreamChat;
dotenv.config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, phoneNumber } = req.body;
    // creating a new user id with random sequence of 16 hexadecimal characters
    const userId = crypto.randomBytes(16).toString("hex");
    // generating the hased Password, it is async function so we have used await
    const hashedPassword = await bcrypt.hash(password, 10);
    // to make a connection to the stream
    const serverClient = connect(api_key, api_secret, app_id);
    // this will generate token, which we will use as cookies( not sure)
    const token = serverClient.createUserToken(userId);

    res
      .status(200)
      .json({ token, fullName, username, userId, hashedPassword, phoneNumber });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // to make a connection to the stream
    const serverClient = connect(api_key, api_secret, app_id);
    // creating a new instance of stream chat
    const client = StreamChat.getInstance(api_key, api_secret);

    // querying the matching of username and password
    const { users } = await client.queryUsers({ name: username });
    // if there is no user with this username
    if (!users.length)
      return res.status(400).json({ message: "no user exist" });

    // we need to compare the passwords, as the stored passwords are in bycrpt form so we need to use bcrypt.compare to convert and comapare the passwords.
    const success = bcrypt.compare(password, users[0].hashedPassword);

    // generating the token using the users id
    const token = serverClient.createUserToken(users[0].id);
    // now we will check if user's password is correct or not, i.e success == true
    if (success) {
      // sending the token and the user details to the client
      res.status(200).json({
        token,
        fullName: users[0].fullName,
        username,
        userId: users[0].id,
      });
    } else {
      res.status(500).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};
