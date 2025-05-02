import axios from 'axios';

export const checkKarmaForCustomer = async (email: string) => {
  const token = process.env.KARMA_BLACKLIST_TOKEN;

  const url = `https://adjutor.lendsqr.com/v2/verification/karma/${email}`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.get(url, config);
    if (response.status === 200) {
      return {
        blacklisted: true,
      };
    }
    return {
      blacklisted: false,
    };
  } catch (error) {
    return {
      blacklisted: false,
    };
  }
};
