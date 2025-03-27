import 'package:flutter/material.dart';
import 'dart:async';
import 'package:google_fonts/google_fonts.dart';
import 'package:jiva/core/utils/app_logger.dart';
import 'package:jiva/features/auth/data/sources/local_auth_service.dart';
import 'package:jiva/injection_container.dart';

class JivaMusicScreen extends StatefulWidget {
  const JivaMusicScreen({Key? key}) : super(key: key);

  @override
  State<JivaMusicScreen> createState() => _JivaMusicScreenState();
}

class _JivaMusicScreenState extends State<JivaMusicScreen> {
  String _userName = "";
  int _currentlyPlayingIndex = -1;
  bool _isPlaying = false;
  double _currentVolume = 0.7;
  
  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final localAuthService = sl<LocalAuthService>();
    final user = localAuthService.getUser();

    if (user != null) {
      setState(() {
        _userName = '${user.firstName} ${user.lastName}';
      });
      AppLogger.debug('Loaded user name: $_userName');
    }
  }
  
  // Navigate back to dashboard
  void _navigateBack() {
    Navigator.pop(context);
  }
  
  // Play/pause track
  void _togglePlay(int index) {
    setState(() {
      if (_currentlyPlayingIndex == index) {
        _isPlaying = !_isPlaying;
      } else {
        _currentlyPlayingIndex = index;
        _isPlaying = true;
      }
    });
  }
  
  // Sample music playlists
  final List<Map<String, dynamic>> _meditationTracks = [
    {
      'title': 'Morning Mindfulness',
      'duration': '10:23',
      'artist': 'Jiva Wellness',
      'cover': 'assets/meditation_cover1.png',
      'category': 'meditation'
    },
    {
      'title': 'Anxiety Relief',
      'duration': '15:45',
      'artist': 'Jiva Wellness',
      'cover': 'assets/meditation_cover2.png',
      'category': 'meditation'
    }
  ];

  final List<Map<String, dynamic>> _sleepTracks = [
    {
      'title': 'Deep Sleep',
      'duration': '45:00',
      'artist': 'Jiva Sleep',
      'cover': 'assets/sleep_cover1.png',
      'category': 'sleep'
    },
    {
      'title': 'Bedtime Relaxation',
      'duration': '30:15',
      'artist': 'Jiva Sleep',
      'cover': 'assets/sleep_cover2.png',
      'category': 'sleep'
    }
  ];

  final List<Map<String, dynamic>> _focusTracks = [
    {
      'title': 'Productivity Boost',
      'duration': '25:00',
      'artist': 'Jiva Focus',
      'cover': 'assets/focus_cover1.png',
      'category': 'focus'
    },
    {
      'title': 'Study Session',
      'duration': '35:30',
      'artist': 'Jiva Focus',
      'cover': 'assets/focus_cover2.png',
      'category': 'focus'
    }
  ];
  
  Widget _buildHeader(Color textColor, Color subtitleColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        GestureDetector(
          onTap: _navigateBack,
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.arrow_back,
              color: Color(0xFF2D2D2D),
            ),
          ),
        ),
        Text(
          'Healing Sounds',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: textColor,
          ),
        ),
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(
            Icons.search,
            color: Color(0xFF2D2D2D),
          ),
        ),
      ],
    );
  }
  
  Widget _buildGreeting(Color textColor) {
    final displayName = _userName.isNotEmpty ? _userName.split(' ')[0] : 'Sarah';
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Hello, $displayName',
          style: GoogleFonts.poppins(
            fontSize: 28,
            fontWeight: FontWeight.w600,
            color: textColor,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Discover sounds to improve your wellbeing',
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: textColor,
          ),
        ),
      ],
    );
  }
  
  Widget _buildFeaturedPlaylist(Color cardColor, Color textColor, Color subtitleColor, Color accentColor) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Featured Playlist',
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: subtitleColor,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(
                  Icons.music_note,
                  color: const Color(0xFF01BF60),
                  size: 40,
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Daily Wellness Mix',
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Personalized mix for your health goals',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: subtitleColor,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: accentColor.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            'Play Now',
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: accentColor,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Icon(
                          Icons.favorite,
                          color: Color(0xFF01BF60),
                          size: 22,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildCategorySection(String title, List<Map<String, dynamic>> tracks, Color cardColor, Color textColor, Color subtitleColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
            ),
            Text(
              'See all',
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: subtitleColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 190,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: tracks.length,
            itemBuilder: (context, index) {
              return _buildTrackCard(tracks[index], cardColor, textColor, subtitleColor, index);
            },
          ),
        ),
      ],
    );
  }
  
  Widget _buildTrackCard(Map<String, dynamic> track, Color cardColor, Color textColor, Color subtitleColor, int index) {
  final bool isPlaying = _currentlyPlayingIndex == index && _isPlaying;
  
  return Container(
    width: 140, // Further reduced from 145 to 140
    margin: const EdgeInsets.only(right: 10), // Reduced from 12 to 10
    decoration: BoxDecoration(
      color: cardColor,
      borderRadius: BorderRadius.circular(20),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          height: 90, // Reduced from 95 to 90
          decoration: BoxDecoration(
            color: _getCategoryColor(track['category']).withOpacity(0.3),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
            ),
          ),
          child: Center(
            child: Icon(
              Icons.music_note,
              color: _getCategoryColor(track['category']),
              size: 26, // Reduced from 28 to 26
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8), // Reduced from 10 to 8
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                track['title'],
                style: GoogleFonts.poppins(
                  fontSize: 12, // Reduced from 13 to 12
                  fontWeight: FontWeight.w600,
                  color: textColor,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2), // Reduced from 3 to 2
              Text(
                track['duration'],
                style: GoogleFonts.poppins(
                  fontSize: 10, // Reduced from 11 to 10
                  fontWeight: FontWeight.w400,
                  color: subtitleColor,
                ),
              ),
              const SizedBox(height: 5), // Reduced from 6 to 5
              GestureDetector(
                onTap: () => _togglePlay(index),
                child: Container(
                  width: 28, // Reduced from 30 to 28
                  height: 28, // Reduced from 30 to 28
                  decoration: BoxDecoration(
                    color: _getCategoryColor(track['category']).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(
                    isPlaying ? Icons.pause : Icons.play_arrow,
                    color: _getCategoryColor(track['category']),
                    size: 14, // Reduced from 16 to 14
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
  
  Color _getCategoryColor(String category) {
    switch (category) {
      case 'meditation':
        return const Color(0xFF01BF60); // Green instead of Pink
      case 'sleep':
        return const Color(0xFF4CD080); // Light green instead of Blue-gray
      case 'focus':
        return const Color(0xFF019D4E); // Dark green instead of Green
      default:
        return const Color(0xFF7FC8A9); // Mint green instead of Purple
    }
  }
  
  @override
  Widget build(BuildContext context) {
    // Using green color palette instead of pink
    const backgroundColor = Color.fromARGB(255, 232, 255, 240); // Soft green background
    const cardColor = Color(0xFFF9FFF9); // Soft white with green tint
    const primaryAccent = Color(0xFF01BF60); // Green accent
    const secondaryAccent = Color(0xFF4CD080); // Light green accent
    const textColor = Color(0xFF2D2D2D); // Dark text for readability
    const subtitleColor = Color(0xFF777777); // Medium gray for subtitles
    
    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 30),
                _buildHeader(textColor, subtitleColor),
                const SizedBox(height: 30),
                _buildGreeting(textColor),
                const SizedBox(height: 30),
                _buildFeaturedPlaylist(cardColor, textColor, subtitleColor, primaryAccent),
                const SizedBox(height: 30),
                _buildCategorySection("Meditation", _meditationTracks, cardColor, textColor, subtitleColor),
                const SizedBox(height: 30),
                _buildCategorySection("Sleep Sounds", _sleepTracks, cardColor, textColor, subtitleColor),
                const SizedBox(height: 30),
                _buildCategorySection("Focus", _focusTracks, cardColor, textColor, subtitleColor),
                const SizedBox(height: 80), // Extra space for bottom nav
              ],
            ),
          ),
        ),
      ),
    );
  }
}