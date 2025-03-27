import 'package:flutter/material.dart';

class BottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const BottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: 10,
        vertical: 8,
      ),
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 8,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 0,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(
          navigationBarTheme: NavigationBarThemeData(
            indicatorColor: const Color(0xFFE0FFE0).withOpacity(0.3),
            surfaceTintColor: Colors.transparent,
            backgroundColor: Colors.transparent,
            height: 50,
            labelBehavior: NavigationDestinationLabelBehavior.alwaysHide,
          ),
        ),
        child: NavigationBar(
          selectedIndex: currentIndex,
          onDestinationSelected: onTap,
          backgroundColor: Colors.transparent,
          elevation: 0,
          height: 50,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysHide,
          animationDuration: const Duration(milliseconds: 400),
          destinations: [
            _buildNavDestination(
              icon: Icons.dashboard_outlined,
              selectedIcon: Icons.dashboard_rounded,
              label: '',
              isSelected: currentIndex == 0,
              theme: theme,
            ),
            _buildNavDestination(
              icon: Icons.assistant_outlined,
              selectedIcon: Icons.assistant_rounded,
              label: '',
              isSelected: currentIndex == 1,
              theme: theme,
            ),
            _buildNavDestination(
              icon: Icons.favorite_border_rounded,
              selectedIcon: Icons.favorite_rounded,
              label: '',
              isSelected: currentIndex == 2,
              theme: theme,
              isCenter: true,
            ),
            _buildNavDestination(
              icon: Icons.emergency_outlined,
              selectedIcon: Icons.emergency_rounded,
              label: '',
              isSelected: currentIndex == 3,
              theme: theme,
            ),
            _buildNavDestination(
              icon: Icons.person_outline,
              selectedIcon: Icons.person,
              label: '',
              isSelected: currentIndex == 4,
              theme: theme,
            ),
          ],
        ),
      ),
    );
  }

  NavigationDestination _buildNavDestination({
    required IconData icon,
    required IconData selectedIcon,
    required String label,
    required bool isSelected,
    required ThemeData theme,
    bool isCenter = false,
  }) {
    return NavigationDestination(
      icon: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 4,
        ),
        child: isCenter
            ? Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color(0xFF4CD080)
                      : const Color(0xFF01BF60),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: Colors.white,
                  size: 24,
                ),
              )
            : Icon(
                icon,
                color: isSelected
                    ? const Color(0xFF019D4E)
                    : const Color(0xFF94A3B8).withOpacity(0.8),
                size: 26,
              ),
      ),
      selectedIcon: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 4,
        ),
        child: isCenter
            ? Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: Color(0xFF019D4E),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  selectedIcon,
                  color: Colors.white,
                  size: 24,
                ),
              )
            : Icon(
                selectedIcon,
                color: const Color(0xFF019D4E),
                size: 26,
              ),
      ),
      label: label,
      tooltip: label,
    );
  }
}

// Example implementation
class FitnessAppBottomNav extends StatefulWidget {
  const FitnessAppBottomNav({super.key});

  @override
  State<FitnessAppBottomNav> createState() => _FitnessAppBottomNavState();
}

class _FitnessAppBottomNavState extends State<FitnessAppBottomNav> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: const Color(0xFFF0FFF5), // Light green background
        child: const Center(
          child: Text('Fitness App Content Area'),
        ),
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}