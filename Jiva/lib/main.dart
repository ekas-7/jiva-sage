import 'package:flutter/material.dart';
import 'package:jiva/core/config/theme.dart';
import 'package:jiva/features/auth/presentation/bloc/signup_bloc/signup_bloc.dart';
import 'package:jiva/features/auth/presentation/screens/signup.dart';
import 'package:jiva/features/landing/presentation/screen/landing_screen.dart';
import 'package:jiva/features/auth/data/sources/local_auth_service.dart';
import 'package:jiva/injection_container.dart' as di;
import 'package:jiva/screens/dashboard.dart';
import 'firebase_options.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/auth/presentation/bloc/signin_bloc/signin_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  await di.init();

  // Check login status
  final localAuthService = di.sl<LocalAuthService>();
  final isLoggedIn = localAuthService.isLoggedIn;

  runApp(MyApp(isLoggedIn: isLoggedIn));
}

class MyApp extends StatelessWidget {
  final bool isLoggedIn;

  const MyApp({
    super.key,
    required this.isLoggedIn,
  });

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => di.sl<SignupBloc>(),
        ),
        BlocProvider(
          create: (context) => di.sl<SignInBloc>(),
        ),
      ],
      child: MaterialApp(
        title: 'jiva',
        theme: AppTheme.lightTheme,
        home: isLoggedIn ? const LandingScreen() : const SignupScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
