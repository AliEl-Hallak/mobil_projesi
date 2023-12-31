import React ,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';
import {DotIndicator} from 'react-native-indicators';
import CustomAlert from '../CustomAlert';

const DeletAppointmentsScreen = ({ route, navigation }) => {
  const { appointmentId, title, date } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Randevuyu Sil',
      'Bu randevuyu silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              setIsLoading(true); // Bekleme durumunu başlat

              await deleteDoc(doc(FIRESTORE_DB, 'appointments', appointmentId));
              setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır
 
              setAlertVisible(true);

             


            } catch (error) {
              setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

              Alert.alert('Hata', 'Randevu silinirken bir hata oluştu: ' + error.message);
            }
          },
        },
      ]
    );
  };
  const handleAlertClose = () => {
    setAlertVisible(false);
    navigation.navigate('Appointment')  
    // Bildirim gönderme işlemi buraya taşındı
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Randevunuz İptal Edildi 🚫",
        body: 'Planlarınızı gözden geçirmeniz gerekebilir. Yeni bir randevu için bizimle iletişime geçebilirsiniz.',
      },
      trigger: { seconds: 1 }, // 1 saniye sonra gönder
    });
  };
  return (
    <View style={styles.container}>
              {isLoading && (
        <View style={styles.loadingContainer}>
<DotIndicator  color='red' />
        </View>
      )}
      <View style={styles.appointmentCard}>
          <View style={styles.lottieContainer}>
          <LottieView
            source={require('../resim/delete.json')} // Make sure this path is correct
            autoPlay
            loop={true}
            style={styles.lottieAnimation}
          />
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}>
          <Icon name="delete" size={24} color="white" />
          <Text style={styles.deleteButtonText}>Randevuyu Sil</Text>
        </TouchableOpacity>
        
      </View>

      <CustomAlert
        visible={alertVisible}
        message="Başarılı', 'Randevu silindi"
        onClose={handleAlertClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',

    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  appointmentCard: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lottieContainer: {
    flexGrow: 1, // This will push the container to the bottom
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 400,
  },
  title: {
    textAlign:'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  deleteButtonText: {
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default DeletAppointmentsScreen;
