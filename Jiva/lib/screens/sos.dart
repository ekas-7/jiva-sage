import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;

class SOSScreen extends StatefulWidget {
  const SOSScreen({Key? key}) : super(key: key);

  @override
  _SOSScreenState createState() => _SOSScreenState();
}

class _SOSScreenState extends State<SOSScreen> {
  // Configuration variables
  final double _fallThreshold = 1000.0; // Fall detection sensitivity
  final int _countdownSeconds = 5; // Countdown before call

  // Hardcoded emergency contact - replace with actual number
  final String _emergencyContact = '+917878156830'; // Replace with your number
  final String _emergencyMessage =
      'I may be in danger. My phone has detected a fall. This is an automated SOS message.';

  // State variables
  bool _isMonitoring = false;
  bool _sosTriggered = false;
  int _remainingSeconds = 0;
  late Timer _timer;
  late StreamSubscription<UserAccelerometerEvent> _userAccelerometerSubscription;

  // Fall detection variables
  bool _possibleFall = false;
  DateTime? _fallStartTime;
  final int _fallDurationThresholdMs = 300; // Minimum fall duration (ms)
  final double _postFallImpactThreshold = 1000.0; // Impact force after fall

  @override
  void initState() {
    super.initState();
    _requestPermissions();
  }

  Future<void> _requestPermissions() async {
    await [
      Permission.sms,
      Permission.phone,
      Permission.sensors,
    ].request();
  }

  void _toggleMonitoring() {
    if (_isMonitoring) {
      _stopMonitoring();
    } else {
      _startMonitoring();
    }
  }

  void _startMonitoring() {
    setState(() {
      _isMonitoring = true;
      _possibleFall = false;
      _fallStartTime = null;
    });

    _userAccelerometerSubscription = userAccelerometerEvents.listen((event) {
      final double acceleration = _calculateMagnitude(event.x, event.y, event.z);
      _detectFall(acceleration);
    });
  }

  void _stopMonitoring() {
    setState(() {
      _isMonitoring = false;
    });
    _userAccelerometerSubscription.cancel();
  }

  double _calculateMagnitude(double x, double y, double z) {
    return (x * x + y * y + z * z);
  }

  void _detectFall(double acceleration) {
    if (!_isMonitoring || _sosTriggered) {
      return;
    }

    if (!_possibleFall && acceleration < _fallThreshold) {
      _possibleFall = true;
      _fallStartTime = DateTime.now();
      print('Possible fall detected: ${acceleration.toStringAsFixed(2)}');
    } else if (_possibleFall && _fallStartTime != null) {
      final fallDuration = DateTime.now().difference(_fallStartTime!).inMilliseconds;

      if (fallDuration >= _fallDurationThresholdMs && acceleration > _postFallImpactThreshold) {
        print('Fall confirmed! Duration: ${fallDuration}ms, Impact: ${acceleration.toStringAsFixed(2)}');
        _triggerSOS();
      } else if (fallDuration > 1000) {
        _possibleFall = false;
        _fallStartTime = null;
      }
    }
  }

  void _triggerSOS() {
    setState(() {
      _sosTriggered = true;
      _remainingSeconds = _countdownSeconds;
      _possibleFall = false;
      _fallStartTime = null;
    });

    _sendSOSApi(); // 🔥 Call the API
    _sendSOSMessage(); // 🔥 Send the SMS

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingSeconds > 0) {
          _remainingSeconds--;
        } else {
          _timer.cancel();
          _makeEmergencyCall();
        }
      });
    });
  }

  Future<void> _sendSOSApi() async {
    const String apiUrl = "https://jiva-data-summarizer.davinder.live/emergency-call";
    final Map<String, dynamic> payload = {
      "phone_number": "+919518864166",
      "user_name": "Davinder Singh",
      "anomaly_type": "medical",
      "location": {
        "address": "123 Main Street, LA , US",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "additional_message": "User has reported chest pain and difficulty breathing."
    };

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200) {
        print("SOS API Success: ${response.body}");
      } else {
        print("SOS API Failed: ${response.statusCode}, ${response.body}");
      }
    } catch (error) {
      print("Error sending SOS API request: $error");
    }
  }

  void _sendSOSMessage() {
    print('SOS Message sent to $_emergencyContact: $_emergencyMessage');
    _launchSMS();
  }

  Future<void> _launchSMS() async {
    final Uri smsUri = Uri(
      scheme: 'sms',
      path: _emergencyContact,
      queryParameters: {'body': _emergencyMessage},
    );

    if (await canLaunchUrl(smsUri)) {
      await launchUrl(smsUri);
    }
  }

  Future<void> _makeEmergencyCall() async {
    final Uri phoneUri = Uri(scheme: 'tel', path: _emergencyContact);

    if (await canLaunchUrl(phoneUri)) {
      await launchUrl(phoneUri);
    }
  }

  void _cancelSOS() {
    _timer.cancel();
    setState(() {
      _sosTriggered = false;
    });
  }

  @override
  void dispose() {
    if (_isMonitoring) {
      _userAccelerometerSubscription.cancel();
    }
    if (_sosTriggered) {
      _timer.cancel();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16.0),
              color: _sosTriggered ? Colors.red : _isMonitoring ? Colors.green : Colors.grey,
              child: Column(
                children: [
                  Text(
                    _sosTriggered ? 'SOS ACTIVATED!' : _isMonitoring ? 'Fall Detection Active' : 'Fall Detection Inactive',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  if (_sosTriggered)
                    Text(
                      'Emergency call in $_remainingSeconds seconds',
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                    ),
                ],
              ),
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: _sosTriggered ? _buildSOSActiveUI() : _buildMonitoringUI(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonitoringUI() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GestureDetector(
          onTap: _toggleMonitoring,
          child: Icon(_isMonitoring ? Icons.shield : Icons.shield_outlined, size: 100, color: _isMonitoring ? Colors.green : Colors.grey),
        ),
        Text(_isMonitoring ? 'Protection Active' : 'Tap to Activate', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildSOSActiveUI() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text('FALL DETECTED - SOS ACTIVATED', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.red)),
        ElevatedButton(onPressed: _cancelSOS, child: const Text('CANCEL SOS')),
      ],
    );
  }
}
