import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeContainer: {
    flexDirection: 'row',
  },
  routeText: {
    fontSize: 12,
    color: '#888',
  },
  routeLocation: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    marginRight: 10,
  },

  // Message Item styles
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  myMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
  },
  myMessageBubble: {
    backgroundColor: '#1E90FF',
  },
  otherMessageBubble: {
    backgroundColor: '#f1f1f1',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },

  // Menu Overlay styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 250,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },

  // Input Section styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    borderRadius: 20,
  },
  inputActions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },

  // Safe Area and container
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
});

export default styles;
