import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  SafeAreaView,
  Modal,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatMessage {
  id: string;
  message: string;
  sender: {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
  };
  time: string;
}

interface ChatResponse {
  chats: ChatMessage[];
  from: string;
  to: string;
  name: string;
}

const MESSAGES_PER_PAGE = 10;
const API_BASE_URL = 'https://qa.corider.in/assignment/chat';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [tripDetails, setTripDetails] = useState({ from: "", to: "", name: "" });
  const [menuVisible, setMenuVisible] = useState(false);

  // Refs for optimizations
  const loadingRef = useRef(loading);
  const loadingOlderRef = useRef(loadingOlder);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);
  const flatListRef = useRef<FlatList>(null);

  // Update refs when state changes
  useEffect(() => {
    loadingRef.current = loading;
    loadingOlderRef.current = loadingOlder;
    hasMoreRef.current = hasMore;
    pageRef.current = page;
  }, [loading, loadingOlder, hasMore, page]);

  const fetchMessages = useCallback(async (isFetchingOlder = false) => {
    if (loadingRef.current || loadingOlderRef.current || !hasMoreRef.current) return;

    isFetchingOlder ? setLoadingOlder(true) : setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}?page=${pageRef.current}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data: ChatResponse = await response.json();

      if (!tripDetails.name) {
        setTripDetails({
          from: data.from,
          to: data.to,
          name: data.name,
        });
      }

      setMessages(prevMessages => {
        const newMessages = isFetchingOlder
          ? [...data.chats, ...prevMessages]
          : [...prevMessages, ...data.chats];

        // Remove duplicates based on message ID
        return Array.from(new Map(newMessages.map(msg => [msg.id, msg])).values());
      });

      setHasMore(data.chats.length >= MESSAGES_PER_PAGE);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      Alert.alert(
        "Error",
        "Failed to load messages. Please check your connection and try again.",
        [{ text: "Retry", onPress: () => fetchMessages(isFetchingOlder) }]
      );
    } finally {
      isFetchingOlder ? setLoadingOlder(false) : setLoading(false);
    }
  }, [tripDetails.name]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    const tempMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      message: newMessage.trim(),
      sender: {
        image: "",
        is_kyc_verified: true,
        self: true,
        user_id: "self",
      },
      time: new Date().toISOString(),
    };

    setMessages(prevMessages => [tempMessage, ...prevMessages]);
    setNewMessage("");


    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [newMessage]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.sender.self ? styles.myMessage : styles.otherMessage
    ]}>
      {!item.sender.self && (
        <Image
          source={{ uri: item.sender.image }}
          style={styles.avatar}

        />
      )}
      <View style={[
        styles.messageBubble,
        item.sender.self ? styles.myMessageBubble : styles.otherMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender.self ? styles.myMessageText : styles.otherMessageText
        ]}>
          {item.message}
        </Text>
      </View>
    </View>
  ), []);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const MenuOverlay = useCallback(() => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={menuVisible}
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={24} color="black" />
            <Text style={styles.menuText}>Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="call-outline" size={24} color="black" />
            <Text style={styles.menuText}>Share Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="alert-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Report</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  ), [menuVisible]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Trip 1</Text>
              <View style={styles.routeContainer}>
                <Text style={styles.routeText}>From </Text>
                <Text style={styles.routeLocation}>{tripDetails.from}</Text>
                <Text style={styles.routeText}> to </Text>
                <Text style={styles.routeLocation}>{tripDetails.to}</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <MenuOverlay />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          style={styles.chatList}
          inverted
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchMessages(true)}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          ListFooterComponent={loading ? (
            <ActivityIndicator size="small" color="gray" style={styles.loadingIndicator} />
          ) : null}
          ListHeaderComponent={loadingOlder ? (
            <ActivityIndicator size="small" color="gray" style={styles.loadingHeader} />
          ) : null}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Reply to @Rohit Yadav"
              placeholderTextColor="#888"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline={false}
              maxLength={1000}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="attach" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="image" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color={newMessage.trim() ? "#1A75FF" : "#666"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  groupImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerInfo: {
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  routeText: {
    fontSize: 14,
    color: "#666",
  },
  routeLocation: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  chatList: {
    flex: 1,
    padding: 16,
  },
  loadingHeader: {
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: "#1A75FF",
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: "#F2F2F2",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  inputActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menuContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 60,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  loadingIndicator: {
    padding: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});