import 'package:flutter/material.dart';
import '../models/dummy_user_model.dart';
import '../models/message_model.dart';
import '../data/chat_data.dart';
import 'package:intl/intl.dart';

// Define theme colors
class ChatThemeColors {
  static const Color primary = Color(0xFFFFB6C1); // Light pink
  static const Color primaryDark = Color(0xFFFF8DA1); // Darker pink
  static const Color secondary = Color(0xFFA2D7FF); // Light blue complement
  static const Color background =
      Color(0xFFFFF5F6); // Very light pink background
  static const Color surface = Colors.white; // White surface
  static const Color accentGreen = Color(0xFF9CE5CB); // Mint accent
  static const Color accentYellow = Color(0xFFFFE6B3); // Soft yellow accent
  static const Color textDark = Color(0xFF454545); // Dark gray for text
  static const Color textLight = Color(0xFF767676); // Medium gray for text
}

class ChatScreen extends StatefulWidget {
  final String currentUserId;
  final User otherUser;

  const ChatScreen({
    Key? key,
    required this.currentUserId,
    required this.otherUser,
  }) : super(key: key);

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ChatRepository _chatRepository = ChatRepository();
  late Stream<List<Message>> _messagesStream;

  @override
  void initState() {
    super.initState();
    _messagesStream = _chatRepository.getMessages(
      widget.currentUserId,
      widget.otherUser.id,
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    final message = Message(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: widget.currentUserId,
      receiverId: widget.otherUser.id,
      content: _messageController.text.trim(),
      timestamp: DateTime.now(),
      isRead: false,
    );

    _chatRepository.sendMessage(message);
    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: ChatThemeColors.primary,
        title: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundColor: ChatThemeColors.secondary.withOpacity(0.3),
              backgroundImage: widget.otherUser.profileImageAsset != null
                  ? NetworkImage(widget.otherUser.profileImageAsset!)
                  : null,
              child: widget.otherUser.profileImageAsset == null
                  ? Text(
                      widget.otherUser.username.substring(0, 1).toUpperCase(),
                      style: const TextStyle(
                        fontSize: 18,
                        color: ChatThemeColors.primaryDark,
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  : null,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.otherUser.username,
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    widget.otherUser.isOnline ? 'Online' : 'Offline',
                    style: TextStyle(
                      fontSize: 12,
                      color: widget.otherUser.isOnline
                          ? ChatThemeColors.accentGreen
                          : Colors.white.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: Colors.white),
            onPressed: () {},
          ),
        ],
        elevation: 2,
        shadowColor: ChatThemeColors.primary.withOpacity(0.5),
      ),
      backgroundColor: ChatThemeColors.background,
      body: Column(
        children: [
          Expanded(
            child: StreamBuilder<List<Message>>(
              stream: _messagesStream,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(
                    child: CircularProgressIndicator(
                      color: ChatThemeColors.primary,
                    ),
                  );
                }
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.chat_bubble_outline,
                          size: 64,
                          color: ChatThemeColors.primary.withOpacity(0.6),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          "No messages yet",
                          style: TextStyle(
                            fontSize: 18,
                            color: ChatThemeColors.textLight,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "Start a conversation!",
                          style: TextStyle(
                            fontSize: 14,
                            color: ChatThemeColors.textLight.withOpacity(0.7),
                          ),
                        ),
                      ],
                    ),
                  );
                }
                final messages = snapshot.data!;
                return ListView.builder(
                  reverse: true,
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final isMe = message.senderId == widget.currentUserId;
                    return Align(
                      alignment:
                          isMe ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(
                            vertical: 6, horizontal: 8),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isMe
                              ? ChatThemeColors.primary
                              : ChatThemeColors.surface,
                          borderRadius: BorderRadius.circular(18).copyWith(
                            bottomRight: isMe ? const Radius.circular(0) : null,
                            bottomLeft: !isMe ? const Radius.circular(0) : null,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: isMe
                                  ? ChatThemeColors.primary.withOpacity(0.3)
                                  : Colors.black.withOpacity(0.05),
                              blurRadius: 5,
                              offset: const Offset(0, 2),
                            ),
                          ],
                          border: !isMe
                              ? Border.all(
                                  color: ChatThemeColors.secondary
                                      .withOpacity(0.3),
                                  width: 1,
                                )
                              : null,
                        ),
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.of(context).size.width * 0.7,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              message.content,
                              style: TextStyle(
                                color: isMe
                                    ? Colors.white
                                    : ChatThemeColors.textDark,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  DateFormat('hh:mm a')
                                      .format(message.timestamp),
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: isMe
                                        ? Colors.white.withOpacity(0.8)
                                        : ChatThemeColors.textLight,
                                  ),
                                ),
                                if (isMe) ...[
                                  const SizedBox(width: 4),
                                  Icon(
                                    message.isRead
                                        ? Icons.done_all
                                        : Icons.done,
                                    size: 12,
                                    color: Colors.white.withOpacity(0.8),
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: ChatThemeColors.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 5,
                  spreadRadius: 1,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: ChatThemeColors.background,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: ChatThemeColors.primary.withOpacity(0.3),
                        width: 1.5,
                      ),
                    ),
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: "Type a message...",
                        hintStyle: TextStyle(
                          color: ChatThemeColors.textLight.withOpacity(0.7),
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 10),
                      ),
                      minLines: 1,
                      maxLines: 3,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Material(
                  color: ChatThemeColors.primary,
                  borderRadius: BorderRadius.circular(50),
                  elevation: 3,
                  shadowColor: ChatThemeColors.primary,
                  child: InkWell(
                    onTap: _sendMessage,
                    borderRadius: BorderRadius.circular(50),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      child: const Icon(
                        Icons.send_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
