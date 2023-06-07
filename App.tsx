import {
  ConnectWallet,
  metamaskWallet,
  ThirdwebProvider,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from '@thirdweb-dev/react-native';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet()]}>
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  const address = useAddress();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const { contract, isLoading: isLoadingContract } = useContract(
    '0x5708A9ef5ED5e8A494aC96c2b8D88F44b02aCB13',
  );
  const { data: userEmail, isLoading: isLoadingUserEmail } = useContractRead(
    contract,
    'getUserEmail',
    [address != null ? address : ''],
  );
  const { data: balance, isLoading: isLoadingBalance } = useContractRead(
    contract,
    'balanceOf',
    [address != null ? address : ''],
  );
  const { data: lastClaimTimestamp, isLoading: isLoadingLastClaim } =
    useContractRead(contract, 'getLastClaimed', [
      address != null ? address : '',
    ]);
  const { mutateAsync: claimCoupons, isLoading: isLoadingClaimCoupons } =
    useContractWrite(contract, 'claimCoupons');
  const { mutateAsync: registerAccount, isLoading: isLoadingRegisterAccount } =
    useContractWrite(contract, 'registerAccount');
  const { mutateAsync: mintTokens, isLoading: isLoadingMintTokens } =
    useContractWrite(contract, 'mintTokens');
  const textStyles = {
    color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  useEffect(() => {
    if (address != null) {
    }
  }, [address]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.navbar}>
        <Text style={textStyles}>Burn2Earn</Text>
        <ConnectWallet />
      </View>
      <View style={styles.view}>
        <Text style={textStyles}>
          {userEmail != ''
            ? 'Wallet is Registered to' + userEmail
            : 'Wallet not registered'}
        </Text>
        <Text style={textStyles}>{'You own ' + balance + ' Buff tokens'}</Text>
        <Text style={textStyles}>
          {'Your last claim was at ethereum timestamp ' + lastClaimTimestamp}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const data = await registerAccount({
                args: [
                  [],
                  '0x7b22616363657373546f6b656e223a22796132392e613041575937436b6b766f6c5030457a53324d5a6e434949556863316d58657a6844495f567a76765a4271493036596a72756c43456c4679576f4e706d4c536b64465449343476706151517430654c597a696b3951644a36415a3062785a36746e5a6b4d77393032434f592d46494563445f7a48355139396530525053647346744c705153696d676f744c527749596479526230554d6d6a7369674652735741614367594b4165305341524153465147317444727058707a675363526d7a7a6e4e436b413949327251696730313635227d',
                  1473,
                  100000,
                ],
              });
            } catch (err) {
              console.error('contract call failure', err);
            }
          }}>
          <Text style={styles.buttonText}>Register Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const data = await mintTokens({
                args: [
                  '0x7b22616363657373546f6b656e223a22796132392e613041575937436b6b766f6c5030457a53324d5a6e434949556863316d58657a6844495f567a76765a4271493036596a72756c43456c4679576f4e706d4c536b64465449343476706151517430654c597a696b3951644a36415a3062785a36746e5a6b4d77393032434f592d46494563445f7a48355139396530525053647346744c705153696d676f744c527749596479526230554d6d6a7369674652735741614367594b4165305341524153465147317444727058707a675363526d7a7a6e4e436b413949327251696730313635227d',
                  1473,
                  100000,
                ],
              });
            } catch (err) {
              console.error('contract call failure', err);
            }
          }}>
          <Text style={styles.buttonText}>Mint Tokens</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const data = await claimCoupons({
                args: [
                  '0xed3437Df782cc5eE46E9f268CbcF5be7Dd082A48', // Dummy contract value
                  0, // Dummy token ID value
                ],
              });
            } catch (err) {
              console.error('contract call failure', err);
            }
          }}>
          <Text style={styles.buttonText}>Claim Coupon</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4287f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
