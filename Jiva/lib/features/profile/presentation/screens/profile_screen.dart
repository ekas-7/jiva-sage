// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:jiva/core/config/colors.dart';
import 'package:jiva/features/auth/domain/entities/user.dart';
import 'package:jiva/features/auth/presentation/screens/login.dart';
import 'package:jiva/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:jiva/injection_container.dart';
import 'package:jiva/models/mood_entry.dart';
import 'package:jiva/sections/appointment.dart';

// Healthcare theme colors
import 'package:flutter/material.dart';

class HealthcareColors {
  // Primary Colors
  static const Color primary = Color(0xFF01bf60); // Green
  static const Color primaryDark = Color(0xFF4CD080); // Lighter green accent
  static const Color secondary = Color(0xFF4CD080); // Lighter green accent

  // Text Colors
  static const Color textPrimary = Color(0xFF2C3E50);
  static const Color textSecondary = Color(0xFF595959);

  // Background Colors
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);

  // State Colors
  static const Color success = Color(0xFF7FC8A9); // Mint green
  static const Color error = Color(0xFFE88D8D); // Soft red
  static const Color warning = Color(0xFFFFD93D); // Muted yellow
}

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => sl<ProfileBloc>()..add(LoadProfile()),
      child: BlocConsumer<ProfileBloc, ProfileState>(
        listener: (context, state) {
          if (state is LogoutSuccess) {
            Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (context) => const LoginScreen()),
              (route) => false,
            );
          }
        },
        builder: (context, state) {
          if (state is ProfileLoading) {
            return const Scaffold(
              body: Center(
                child: CircularProgressIndicator(
                  color: HealthcareColors.primary,
                ),
              ),
            );
          }

          if (state is ProfileError) {
            return Scaffold(
              body: Center(
                child: Text(
                  state.message,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: HealthcareColors.error,
                      ),
                ),
              ),
            );
          }

          if (state is ProfileLoaded) {
            return Scaffold(
              backgroundColor: HealthcareColors.background,
              appBar: AppBar(
                automaticallyImplyLeading: false,
                title: Row(
                  children: [
                    Icon(
                      Icons.health_and_safety,
                      color: HealthcareColors.primary,
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Health Profile',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: HealthcareColors.textPrimary,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                  ],
                ),
                actions: [
                  IconButton(
                    icon: Icon(
                      Icons.logout_rounded,
                      color: HealthcareColors.error,
                    ),
                    onPressed: () {
                      final profileBloc = context.read<ProfileBloc>();
                      showDialog(
                        context: context,
                        builder: (dialogContext) => AlertDialog(
                          title: Text(
                            'Sign Out',
                            style: Theme.of(context)
                                .textTheme
                                .titleLarge
                                ?.copyWith(
                                  color: HealthcareColors.textPrimary,
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                          content: Text(
                            'Are you sure you want to sign out of your health account?',
                            style:
                                Theme.of(context).textTheme.bodyLarge?.copyWith(
                                      color: HealthcareColors.textSecondary,
                                    ),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(dialogContext),
                              child: Text(
                                'Cancel',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyLarge
                                    ?.copyWith(
                                      color: HealthcareColors.textSecondary,
                                    ),
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () {
                                profileBloc.add(LogoutRequested());
                                Navigator.pop(dialogContext);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: HealthcareColors.error,
                                foregroundColor: HealthcareColors.surface,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: Text(
                                'Sign Out',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyLarge
                                    ?.copyWith(
                                      color: HealthcareColors.surface,
                                      fontWeight: FontWeight.w600,
                                    ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(width: 8),
                ],
                backgroundColor: HealthcareColors.surface,
                elevation: 0,
              ),
              body: SingleChildScrollView(
                child: Column(
                  children: [
                    _buildProfileHeader(state.user, Theme.of(context)),
                    buildWellbeingChart(state.moodEntries, Theme.of(context)),
                    _buildUpcomingAppointmentsSection(),
                    _buildUserInfoSection(state.user, Theme.of(context)),
                    _buildHealthActivitySection(Theme.of(context)),
                    const SizedBox(height: 70),
                  ],
                ),
              ),
            );
          }

          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(
                color: HealthcareColors.primary,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildProfileHeader(User user, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 40),
      decoration: BoxDecoration(
        color: HealthcareColors.surface,
        borderRadius: const BorderRadius.vertical(
          bottom: Radius.circular(32),
        ),
        boxShadow: [
          BoxShadow(
            color: HealthcareColors.primary.withOpacity(0.12),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: HealthcareColors.primary.withOpacity(0.3),
                width: 3,
              ),
              boxShadow: [
                BoxShadow(
                  color: HealthcareColors.primary.withOpacity(0.15),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: CircleAvatar(
              radius: 50,
              backgroundColor: HealthcareColors.primary.withOpacity(0.15),
              child: Text(
                user.firstName[0] + user.lastName[0],
                style: theme.textTheme.headlineLarge?.copyWith(
                  color: HealthcareColors.primaryDark,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            '${user.firstName} ${user.lastName}',
            style: theme.textTheme.headlineMedium?.copyWith(
              color: HealthcareColors.textPrimary,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.3,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.mail_outline_rounded,
                size: 16,
                color: HealthcareColors.primary.withOpacity(0.7),
              ),
              const SizedBox(width: 8),
              Text(
                user.email,
                style: theme.textTheme.titleMedium?.copyWith(
                  color: HealthcareColors.textSecondary,
                  letterSpacing: 0.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildProfileStat(
                  'Health Goals', '${user.interests.length}', theme),
              Container(
                height: 24,
                width: 1,
                color: HealthcareColors.primary.withOpacity(0.2),
              ),
              _buildProfileStat('Patient Since',
                  DateFormat('MMM yyyy').format(user.createdAt), theme),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProfileStat(String label, String value, ThemeData theme) {
    return Column(
      children: [
        Text(
          value,
          style: theme.textTheme.titleLarge?.copyWith(
            color: HealthcareColors.primaryDark,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: HealthcareColors.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget buildWellbeingChart(List<MoodEntry> entries, ThemeData theme) {
    // For demo purposes, let's create some sample health data
    final lastWeek = List.generate(
        7, (index) => DateTime.now().subtract(Duration(days: 6 - index)));

    // Sample step data (between 2000-10000 steps)
    final stepData = [7234, 5692, 8431, 6302, 9125, 4872, 8753];

    // Sample heart rate data (between 60-85 bpm)
    final heartRateData = [72, 75, 68, 82, 65, 78, 70];

    // Sample sleep data (between 5-8 hours)
    final sleepData = [6.7, 7.2, 5.8, 6.5, 7.8, 6.3, 7.5];

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: HealthcareColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: HealthcareColors.primary.withOpacity(0.2),
        ),
        boxShadow: [
          BoxShadow(
            color: HealthcareColors.primary.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.monitor_heart_outlined,
                  color: HealthcareColors.primaryDark,
                  size: 22,
                ),
                const SizedBox(width: 10),
                Text(
                  'Health Metrics',
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: HealthcareColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    getDrawingHorizontalLine: (value) {
                      return FlLine(
                        color: HealthcareColors.primary.withOpacity(0.1),
                        strokeWidth: 1,
                      );
                    },
                  ),
                  titlesData: FlTitlesData(
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          if (value.toInt() >= 0 && value.toInt() < 7) {
                            final date = lastWeek[value.toInt()];
                            return Padding(
                              padding: const EdgeInsets.only(top: 8.0),
                              child: Text(
                                DateFormat('E')
                                    .format(date), // Weekday abbreviation
                                style: TextStyle(
                                  fontSize: 10,
                                  color: HealthcareColors.textSecondary,
                                ),
                              ),
                            );
                          }
                          return const Text('');
                        },
                        reservedSize: 30,
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 40,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            value.toInt().toString(),
                            style: TextStyle(
                              fontSize: 10,
                              color: HealthcareColors.textSecondary,
                            ),
                          );
                        },
                      ),
                    ),
                    topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  minX: 0,
                  maxX: 6,
                  minY: 0,
                  maxY: 10000,
                  lineBarsData: [
                    LineChartBarData(
                      spots: List.generate(7, (index) {
                        return FlSpot(
                            index.toDouble(), stepData[index].toDouble());
                      }),
                      isCurved: true,
                      color: HealthcareColors.primaryDark,
                      barWidth: 3,
                      isStrokeCapRound: true,
                      dotData: FlDotData(
                        show: true,
                        getDotPainter: (spot, percent, barData, index) {
                          return FlDotCirclePainter(
                            radius: 5,
                            color: HealthcareColors.primaryDark,
                            strokeWidth: 2,
                            strokeColor: HealthcareColors.surface,
                          );
                        },
                      ),
                      belowBarData: BarAreaData(
                        show: true,
                        color: HealthcareColors.primary.withOpacity(0.1),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 8),
            Center(
              child: Text(
                "Daily Steps",
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: HealthcareColors.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Health metrics cards
            Row(
              children: [
                Expanded(
                  child: _buildHealthMetricCard(
                    icon: Icons.favorite_border,
                    title: "Heart Rate",
                    value: "${heartRateData.last} bpm",
                    trend: "+2 from yesterday",
                    color: HealthcareColors.error.withOpacity(0.8),
                    theme: theme,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildHealthMetricCard(
                    icon: Icons.nightlight_outlined,
                    title: "Sleep",
                    value: "${sleepData.last} hrs",
                    trend: "+1.2 hrs from avg",
                    color: HealthcareColors.secondary,
                    theme: theme,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _buildHealthMetricCard(
                    icon: Icons.directions_walk,
                    title: "Steps",
                    value: "${stepData.last}",
                    trend: "87% of goal",
                    color: HealthcareColors.primaryDark,
                    theme: theme,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildHealthMetricCard(
                    icon: Icons.local_fire_department_outlined,
                    title: "Calories",
                    value: "432 kcal",
                    trend: "Active burn",
                    color: HealthcareColors.warning,
                    theme: theme,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthMetricCard({
    required IconData icon,
    required String title,
    required String value,
    required String trend,
    required Color color,
    required ThemeData theme,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                size: 18,
                color: color,
              ),
              const SizedBox(width: 6),
              Text(
                title,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: HealthcareColors.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: theme.textTheme.titleLarge?.copyWith(
              color: HealthcareColors.textPrimary,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            trend,
            style: theme.textTheme.bodySmall?.copyWith(
              color: HealthcareColors.textSecondary,
              fontWeight: FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUpcomingAppointmentsSection() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Container(
        decoration: BoxDecoration(
          color: HealthcareColors.surface,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: HealthcareColors.primary.withOpacity(0.2),
          ),
          boxShadow: [
            BoxShadow(
              color: HealthcareColors.primary.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Container(
                height: 50,
                width: 50,
                decoration: BoxDecoration(
                  color: HealthcareColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.calendar_today_rounded,
                  color: HealthcareColors.primaryDark,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Healthcare Appointments',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: HealthcareColors.textPrimary,
                      ),
                    ),
                    Text(
                      'View your upcoming therapy and wellness sessions',
                      style: TextStyle(
                        color: HealthcareColors.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: Icon(
                  Icons.arrow_forward_ios,
                  color: HealthcareColors.primaryDark,
                  size: 20,
                ),
                onPressed: () {
                  // Navigate to the upcoming appointments screen
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => UpcomingAppointmentsScreen(),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUserInfoSection(User user, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: HealthcareColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: HealthcareColors.primary.withOpacity(0.2),
        ),
        boxShadow: [
          BoxShadow(
            color: HealthcareColors.primary.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.person_outline_rounded,
                  color: HealthcareColors.primaryDark,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Text(
                  'Patient Information',
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: HealthcareColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildInfoRow('Email', user.email, Icons.email_outlined, theme),
            _buildInfoRow(
                'Phone', user.phoneNumber, Icons.phone_outlined, theme),
            _buildInfoRow(
              'Patient since',
              DateFormat('MMMM yyyy').format(user.createdAt),
              Icons.calendar_today_outlined,
              theme,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(
      String label, String value, IconData icon, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 20,
            color: HealthcareColors.primary.withOpacity(0.7),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: HealthcareColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: HealthcareColors.textPrimary,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthActivitySection(ThemeData theme) {
    // Sample activity data
    final activityData = [
      {
        'name': 'Morning Walk',
        'type': 'Walking',
        'duration': '30 min',
        'calories': '120 kcal',
        'steps': '3,504',
        'date': 'Today, 6:30 AM',
        'icon': Icons.directions_walk,
        'color': HealthcareColors.primaryDark,
      },
      {
        'name': 'Yoga Session',
        'type': 'Yoga',
        'duration': '45 min',
        'calories': '165 kcal',
        'steps': '150',
        'date': 'Yesterday, 5:45 PM',
        'icon': Icons.self_improvement,
        'color': HealthcareColors.secondary,
      },
      {
        'name': 'Evening Run',
        'type': 'Running',
        'duration': '25 min',
        'calories': '230 kcal',
        'steps': '4,120',
        'date': 'Yesterday, 7:15 AM',
        'icon': Icons.run_circle_outlined,
        'color': HealthcareColors.warning,
      },
    ];

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: HealthcareColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: HealthcareColors.primary.withOpacity(0.2),
        ),
        boxShadow: [
          BoxShadow(
            color: HealthcareColors.primary.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.fitness_center,
                  color: HealthcareColors.primaryDark,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Text(
                  'Recent Activities',
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: HealthcareColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Weekly summary
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: HealthcareColors.primary.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildWeeklyStat(
                      '7,842', 'Avg Steps', Icons.directions_walk, theme),
                  Container(
                      height: 40,
                      width: 1,
                      color: HealthcareColors.primary.withOpacity(0.2)),
                  _buildWeeklyStat(
                      '4', 'Workouts', Icons.fitness_center, theme),
                  Container(
                      height: 40,
                      width: 1,
                      color: HealthcareColors.primary.withOpacity(0.2)),
                  _buildWeeklyStat('515', 'Calories',
                      Icons.local_fire_department_outlined, theme),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Activity list
            ...activityData
                .map((activity) => _buildActivityItem(activity, theme)),

            const SizedBox(height: 12),

            // View more button
            Center(
              child: TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(
                  foregroundColor: HealthcareColors.primaryDark,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'View All Activities',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: HealthcareColors.primaryDark,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      Icons.arrow_forward,
                      size: 16,
                      color: HealthcareColors.primaryDark,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeeklyStat(
      String value, String label, IconData icon, ThemeData theme) {
    return Column(
      children: [
        Row(
          children: [
            Icon(
              icon,
              size: 16,
              color: HealthcareColors.primaryDark,
            ),
            const SizedBox(width: 4),
            Text(
              value,
              style: theme.textTheme.titleMedium?.copyWith(
                color: HealthcareColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: HealthcareColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildActivityItem(Map<String, dynamic> activity, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: (activity['color'] as Color).withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: (activity['color'] as Color).withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 40,
            width: 40,
            decoration: BoxDecoration(
              color: (activity['color'] as Color).withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              activity['icon'] as IconData,
              color: activity['color'] as Color,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  activity['name'] as String,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: HealthcareColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  activity['date'] as String,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: HealthcareColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildActivityStat(
                      activity['duration'] as String,
                      'Duration',
                      theme,
                    ),
                    const SizedBox(width: 12),
                    _buildActivityStat(
                      activity['calories'] as String,
                      'Calories',
                      theme,
                    ),
                    const SizedBox(width: 12),
                    _buildActivityStat(
                      activity['steps'] as String,
                      'Steps',
                      theme,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityStat(String value, String label, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: HealthcareColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: HealthcareColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Map<String, int> _calculateWellbeingStats(List<MoodEntry> entries) {
    final moodCounts = {
      'Happy': 0,
      'Good': 0,
      'Neutral': 0,
      'Sad': 0,
      'Angry': 0,
    };

    for (var entry in entries) {
      final mood = entry.mood.toLowerCase();
      switch (mood) {
        case 'happy':
          moodCounts['Happy'] = (moodCounts['Happy'] ?? 0) + 1;
          break;
        case 'good':
          moodCounts['Good'] = (moodCounts['Good'] ?? 0) + 1;
          break;
        case 'neutral':
          moodCounts['Neutral'] = (moodCounts['Neutral'] ?? 0) + 1;
          break;
        case 'sad':
          moodCounts['Sad'] = (moodCounts['Sad'] ?? 0) + 1;
          break;
        case 'angry':
          moodCounts['Angry'] = (moodCounts['Angry'] ?? 0) + 1;
          break;
      }
    }

    return moodCounts;
  }
}
