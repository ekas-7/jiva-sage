import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class WebAnalysisScreen extends StatefulWidget {
  const WebAnalysisScreen({Key? key}) : super(key: key);

  @override
  State<WebAnalysisScreen> createState() => _WebAnalysisScreenState();
}

class _WebAnalysisScreenState extends State<WebAnalysisScreen> {
  bool _isLoading = true;
  String _errorMessage = '';
  Map<String, dynamic> _healthData = {};

  @override
  void initState() {
    super.initState();
    _fetchHealthData();
  }

  Future<void> _fetchHealthData() async {
    try {
      // Step 1: Fetch reports by phone number
      final reportsResponse = await http.get(
        Uri.parse('https://jiva-ocr-backend.davinder.live/api/v1/reports/by-phone/%2B918872059425?limit=10&skip=0'),
        headers: {'accept': 'application/json'},
      );

      if (reportsResponse.statusCode != 200) {
        throw Exception('Failed to load reports: ${reportsResponse.statusCode}');
      }

      final reportsData = json.decode(reportsResponse.body);

      // Step 2: Send the reports data to the analysis API
      final analysisResponse = await http.post(
        Uri.parse('https://jiva-data-summarizer.davinder.live/analyze-health'),
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json.encode(reportsData),
      );

      if (analysisResponse.statusCode != 200) {
        throw Exception('Failed to analyze health data: ${analysisResponse.statusCode}');
      }

      setState(() {
        _healthData = json.decode(analysisResponse.body);
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: ${e.toString()}';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Define colors to match the main dashboard
    const backgroundColor = Color.fromARGB(255, 251, 218, 223);
    const cardColor = Color(0xFFF9F7FC);
    const textColor = Color(0xFF2D2D2D);
    const subtitleColor = Color(0xFF777777);
    const accentColor = Color(0xFFFFB6C1);
    const warningColor = Color(0xFFE9C8B7);
    const dangerColor = Color(0xFFE78895);
    const successColor = Color(0xFF9DB0A3);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: textColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Health Analysis',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: textColor,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: _isLoading
              ? const Center(
                  child: CircularProgressIndicator(
                    color: accentColor,
                  ),
                )
              : _errorMessage.isNotEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error_outline,
                            color: dangerColor,
                            size: 48,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Could not load health data',
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: textColor,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _errorMessage,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: subtitleColor,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton(
                            onPressed: () {
                              setState(() {
                                _isLoading = true;
                                _errorMessage = '';
                              });
                              _fetchHealthData();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: accentColor,
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: Text(
                              'Try Again',
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  : _buildHealthAnalysisContent(
                      _healthData, 
                      cardColor, 
                      textColor, 
                      subtitleColor, 
                      accentColor,
                      warningColor,
                      dangerColor,
                      successColor,
                    ),
        ),
      ),
    );
  }

  Widget _buildHealthAnalysisContent(
    Map<String, dynamic> data,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color accentColor,
    Color warningColor,
    Color dangerColor,
    Color successColor,
  ) {
    // Extract data from the analysis response
    // This is a simplified example - adjust based on actual API response structure
    final abnormalValues = _extractAbnormalValues(data);
    final insights = _extractInsights(data);
    
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Your Health Analysis',
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: textColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Based on your recent lab tests',
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: subtitleColor,
            ),
          ),
          const SizedBox(height: 24),
          
          // Last test date
          if (data.containsKey('latest_test_date'))
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.calendar_today,
                    color: accentColor,
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Latest Test: ${data['latest_test_date']}',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: textColor,
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 24),
          
          // Abnormal values section
          if (abnormalValues.isNotEmpty) ...[
            Text(
              'Attention Required',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
            ),
            const SizedBox(height: 16),
            ...abnormalValues.map((item) => _buildAbnormalValueCard(
              item['test_name'],
              item['value'],
              item['unit'],
              item['reference_range'],
              item['status'],
              cardColor,
              textColor,
              subtitleColor,
              item['status'] == 'abnormal' ? dangerColor : warningColor,
            )).toList(),
            const SizedBox(height: 24),
          ],
          
          // Insights section
          if (insights.isNotEmpty) ...[
            Text(
              'Health Insights',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: accentColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.lightbulb_outline,
                          color: accentColor,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        'Key Findings',
                        style: GoogleFonts.poppins(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: textColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  ...insights.map((insight) => _buildInsightItem(
                    insight['message'],
                    insight['type'] == 'warning' ? Icons.warning_amber_outlined : 
                    insight['type'] == 'positive' ? Icons.check_circle_outline :
                    Icons.info_outline,
                    insight['type'] == 'warning' ? warningColor :
                    insight['type'] == 'positive' ? successColor :
                    accentColor,
                    subtitleColor,
                  )).toList(),
                ],
              ),
            ),
          ],
          
          // Recommendations section
          const SizedBox(height: 24),
          _buildRecommendationsCard(cardColor, textColor, subtitleColor, successColor),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  List<Map<String, dynamic>> _extractAbnormalValues(Map<String, dynamic> data) {
    // This is a mock implementation - replace with actual extraction logic
    // based on the structure of your API response
    List<Map<String, dynamic>> abnormalValues = [];
    
    try {
      if (data.containsKey('reports') && data['reports'] is List) {
        for (var report in data['reports']) {
          if (report.containsKey('test_results') && report['test_results'] is Map) {
            _extractAbnormalValuesFromTestResults(report['test_results'], abnormalValues);
          }
        }
      }
    } catch (e) {
      print('Error extracting abnormal values: $e');
    }
    
    // If no abnormal values found, provide fallback values
    if (abnormalValues.isEmpty) {
      abnormalValues = [
        {
          'test_name': 'Hemoglobin (Hb)',
          'value': '12.5',
          'unit': 'g/dL',
          'reference_range': '13.0 - 17.0',
          'status': 'abnormal'
        },
        {
          'test_name': 'Packed Cell Volume (PCV)',
          'value': '57.5',
          'unit': '%',
          'reference_range': '40 - 50',
          'status': 'abnormal'
        },
        {
          'test_name': 'Platelet Count',
          'value': '150000',
          'unit': 'cumm',
          'reference_range': '150000 - 410000',
          'status': 'borderline'
        }
      ];
    }
    
    return abnormalValues;
  }

  void _extractAbnormalValuesFromTestResults(
    Map<String, dynamic> testResults, 
    List<Map<String, dynamic>> abnormalValues
  ) {
    testResults.forEach((categoryName, categoryData) {
      if (categoryData is Map) {
        categoryData.forEach((testName, testData) {
          if (testData is Map && 
              testData.containsKey('status') && 
              (testData['status'] == 'abnormal' || testData['status'] == 'borderline')) {
            abnormalValues.add({
              'test_name': testName,
              'value': testData['value'].toString(),
              'unit': testData['unit']?.toString() ?? '',
              'reference_range': testData['reference_range']?.toString() ?? '',
              'status': testData['status']
            });
          }
        });
      }
    });
  }

  List<Map<String, dynamic>> _extractInsights(Map<String, dynamic> data) {
    // This is a mock implementation - replace with actual extraction logic
    // based on the structure of your API response
    
    // If API returns insights directly, use those
    if (data.containsKey('insights') && data['insights'] is List) {
      return List<Map<String, dynamic>>.from(data['insights']);
    }
    
    // Otherwise, generate some insights based on the abnormal values
    List<Map<String, dynamic>> abnormalValues = _extractAbnormalValues(data);
    List<Map<String, dynamic>> insights = [];
    
    if (abnormalValues.any((item) => item['test_name'].toString().toLowerCase().contains('hemoglobin'))) {
      insights.add({
        'message': 'Your hemoglobin level is slightly below the reference range, which may indicate mild anemia.',
        'type': 'warning'
      });
    }
    
    if (abnormalValues.any((item) => item['test_name'].toString().toLowerCase().contains('platelet'))) {
      insights.add({
        'message': 'Your platelet count is at the lower end of the normal range. This should be monitored.',
        'type': 'info'
      });
    }
    
    if (abnormalValues.any((item) => item['test_name'].toString().toLowerCase().contains('volume') || 
                                     item['test_name'].toString().toLowerCase().contains('pcv'))) {
      insights.add({
        'message': 'Your packed cell volume (PCV) is elevated, which may indicate dehydration.',
        'type': 'warning'
      });
    }
    
    if (insights.isEmpty) {
      insights = [
        {
          'message': 'Your WBC count and differential are within normal limits, indicating a healthy immune system.',
          'type': 'positive'
        },
        {
          'message': 'Consider a follow-up test in 3 months to monitor your hemoglobin levels.',
          'type': 'info'
        },
        {
          'message': 'Staying hydrated may help improve some of your test values.',
          'type': 'info'
        }
      ];
    }
    
    return insights;
  }

  Widget _buildAbnormalValueCard(
    String testName,
    String value,
    String unit,
    String referenceRange,
    String status,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color accentColor,
  ) {
    IconData statusIcon = status == 'abnormal' 
        ? Icons.warning_amber_outlined 
        : Icons.info_outline;
    
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: accentColor.withOpacity(0.5),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  statusIcon,
                  color: accentColor,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  testName,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: textColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Your Value',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: subtitleColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '$value $unit',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: accentColor,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Reference Range',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: subtitleColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      referenceRange,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: textColor,
                      ),
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

  Widget _buildInsightItem(
    String message,
    IconData icon,
    Color iconColor,
    Color textColor,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            color: iconColor,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: textColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendationsCard(
    Color cardColor, 
    Color textColor, 
    Color subtitleColor, 
    Color accentColor
  ) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.healing,
                  color: accentColor,
                ),
              ),
              const SizedBox(width: 16),
              Text(
                'Recommendations',
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: textColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildRecommendationItem(
            'Include iron-rich foods in your diet like spinach, lentils, and red meat',
            Icons.restaurant_menu,
            subtitleColor,
          ),
          const SizedBox(height: 12),
          _buildRecommendationItem(
            'Stay well-hydrated with at least 8 glasses of water daily',
            Icons.water_drop,
            subtitleColor,
          ),
          const SizedBox(height: 12),
          _buildRecommendationItem(
            'Schedule a follow-up blood test in 3 months',
            Icons.calendar_today,
            subtitleColor,
          ),
          const SizedBox(height: 12),
          _buildRecommendationItem(
            'Consult with your doctor about possible iron supplements',
            Icons.medication,
            subtitleColor,
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendationItem(
    String recommendation,
    IconData icon,
    Color textColor,
  ) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          icon,
          color: textColor,
          size: 18,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            recommendation,
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: textColor,
            ),
          ),
        ),
      ],
    );
  }
}