import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:camera/camera.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:google_ml_kit/google_ml_kit.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:intl/intl.dart';

class MedicalScanner extends StatefulWidget {
  const MedicalScanner({Key? key}) : super(key: key);

  @override
  _MedicalScannerState createState() => _MedicalScannerState();
}

class _MedicalScannerState extends State<MedicalScanner>
    with TickerProviderStateMixin {
  CameraController? _cameraController;
  List<CameraDescription> cameras = [];
  bool _isCameraInitialized = false;
  bool _isProcessing = false;
  bool _isFrontCamera = false;
  double _minAvailableZoom = 1.0;
  double _maxAvailableZoom = 1.0;
  double _currentZoomLevel = 1.0;
  FlashMode _flashMode = FlashMode.off;
  File? _scannedDocument;
  String _documentType = "Medical Report";
  String _recognizedText = "";
  List<MedicalDocument> _savedDocuments = [];

  // Animation controllers
  late AnimationController _scanAnimationController;
  late Animation<double> _scanAnimation;
  late AnimationController _pulseAnimationController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _initializeCamera();

    // Setup scan line animation
    _scanAnimationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    _scanAnimation = Tween<double>(begin: -1.0, end: 1.0).animate(
        CurvedAnimation(
            parent: _scanAnimationController, curve: Curves.easeInOut));

    // Setup pulse animation for capture button
    _pulseAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
        CurvedAnimation(
            parent: _pulseAnimationController, curve: Curves.easeInOut));

    // Add some sample documents for demo purposes
    _addSampleDocuments();
  }

  void _addSampleDocuments() {
    // Only add sample documents if the list is empty
    if (_savedDocuments.isEmpty) {
      final now = DateTime.now();
      final dateFormat = DateFormat('MMM d, yyyy, HH:mm');

      // Sample document 1
      _savedDocuments.add(MedicalDocument(
        id: '1',
        path:
            'assets/sample_prescription.jpg', // This would be a real path in production
        type: 'Prescription',
        date: dateFormat.format(now.subtract(const Duration(days: 2))),
        text:
            'Rx: Amoxicillin 500mg\nTake 1 tablet three times daily for 7 days\nDr. Smith',
        isSample: true,
      ));

      // Sample document 2
      _savedDocuments.add(MedicalDocument(
        id: '2',
        path:
            'assets/sample_report.jpg', // This would be a real path in production
        type: 'Medical Report',
        date: dateFormat.format(now.subtract(const Duration(days: 5))),
        text:
            'Blood Test Results\nHemoglobin: 14.2 g/dL (Normal)\nWhite Blood Cells: 7.5x10^9/L (Normal)\nCholesterol: 185 mg/dL (Normal)',
        isSample: true,
      ));
    }
  }

  Future<void> _initializeCamera() async {
    cameras = await availableCameras();
    if (cameras.isEmpty) return;

    _cameraController = CameraController(
      cameras[0],
      ResolutionPreset.high,
      enableAudio: false,
    );

    await _cameraController!.initialize();

    if (!mounted) return;

    _cameraController!.getMinZoomLevel().then((value) {
      _minAvailableZoom = value;
    });

    _cameraController!.getMaxZoomLevel().then((value) {
      _maxAvailableZoom = value;
    });

    setState(() {
      _isCameraInitialized = true;
    });
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    _scanAnimationController.dispose();
    _pulseAnimationController.dispose();
    super.dispose();
  }

  Future<void> _switchCamera() async {
    if (cameras.length < 2) return;

    setState(() {
      _isCameraInitialized = false;
      _isFrontCamera = !_isFrontCamera;
    });

    await _cameraController?.dispose();

    _cameraController = CameraController(
      cameras[_isFrontCamera ? 1 : 0],
      ResolutionPreset.high,
      enableAudio: false,
    );

    await _cameraController!.initialize();

    if (!mounted) return;

    setState(() {
      _isCameraInitialized = true;
    });
  }

  Future<void> _captureImage() async {
    if (_cameraController == null || _isProcessing) return;

    setState(() {
      _isProcessing = true;
    });

    try {
      // Play haptic feedback
      HapticFeedback.mediumImpact();

      // Capture image
      final XFile photo = await _cameraController!.takePicture();

      // Get application directory
      final directory = await getApplicationDocumentsDirectory();
      final fileName = '${DateTime.now().millisecondsSinceEpoch}.jpg';
      final filePath = path.join(directory.path, fileName);

      // Compress and save image
      await FlutterImageCompress.compressAndGetFile(
        photo.path,
        filePath,
        quality: 90,
      );

      _scannedDocument = File(filePath);

      // Process the image with ML Kit
      await _processImage();

      // Save document information
      _saveDocumentInfo();

      // Show success notification
      _showSuccessNotification();
    } catch (e) {
      print("Error capturing image: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error capturing image: $e')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  Future<void> _pickImageFromGallery() async {
    if (_isProcessing) return;

    setState(() {
      _isProcessing = true;
    });

    try {
      final ImagePicker picker = ImagePicker();
      final XFile? pickedFile =
          await picker.pickImage(source: ImageSource.gallery);

      if (pickedFile == null) {
        setState(() {
          _isProcessing = false;
        });
        return;
      }

      _scannedDocument = File(pickedFile.path);

      // Process the image with ML Kit
      await _processImage();

      // Save document information
      _saveDocumentInfo();

      // Show success notification
      _showSuccessNotification();
    } catch (e) {
      print("Error picking image: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  Future<void> _processImage() async {
    if (_scannedDocument == null) return;

    try {
      final inputImage = InputImage.fromFile(_scannedDocument!);
      final textRecognizer = GoogleMlKit.vision.textRecognizer();
      final RecognizedText recognizedText =
          await textRecognizer.processImage(inputImage);

      // Determine document type based on recognized text
      String text = recognizedText.text.toLowerCase();
      String docType = "Medical Document";

      if (text.contains("prescription") ||
          text.contains("rx") ||
          text.contains("take")) {
        docType = "Prescription";
      } else if (text.contains("report") ||
          text.contains("test") ||
          text.contains("result")) {
        docType = "Medical Report";
      } else if (text.contains("bill") ||
          text.contains("invoice") ||
          text.contains("payment")) {
        docType = "Medical Bill";
      }

      setState(() {
        _recognizedText = recognizedText.text;
        _documentType = docType;
      });

      await textRecognizer.close();
    } catch (e) {
      print("Error processing image: $e");
    }
  }

  void _saveDocumentInfo() {
    if (_scannedDocument == null) return;

    final now = DateTime.now();
    final dateFormat = DateFormat('MMM d, yyyy, HH:mm');

    final newDoc = MedicalDocument(
      id: now.millisecondsSinceEpoch.toString(),
      path: _scannedDocument!.path,
      type: _documentType,
      date: dateFormat.format(now),
      text: _recognizedText,
      isSample: false,
    );

    setState(() {
      _savedDocuments.add(newDoc);
    });
  }

  void _showSuccessNotification() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: const [
            Icon(Icons.check_circle, color: Colors.white),
            SizedBox(width: 10),
            Text('Document successfully scanned and saved!'),
          ],
        ),
        backgroundColor: const Color(0xFFFFB6C1), // Light pink
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  void _showDocumentDetails(MedicalDocument document) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (_, controller) => Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 10,
                spreadRadius: 1,
              ),
            ],
          ),
          child: ListView(
            controller: controller,
            padding: const EdgeInsets.all(20),
            children: [
              const Center(
                child: SizedBox(
                  width: 50,
                  child: Divider(thickness: 5),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    document.type,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFF8DA1), // Darker pink
                    ),
                  ),
                  Text(
                    document.date,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              // For sample documents, show a placeholder image
              document.isSample
                  ? Container(
                      height: 200,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              document.type == 'Prescription'
                                  ? Icons.medical_services_outlined
                                  : Icons.description_outlined,
                              size: 50,
                              color: const Color(0xFFFF8DA1),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              document.type,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  : ClipRRect(
                      borderRadius: BorderRadius.circular(15),
                      child: Image.file(
                        File(document.path),
                        fit: BoxFit.cover,
                      ),
                    ),
              const SizedBox(height: 20),
              const Text(
                "Recognized Text:",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  document.text.isNotEmpty
                      ? document.text
                      : "No text recognized in this document.",
                  style: const TextStyle(
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ),
              const SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildActionButton(
                    icon: Icons.share,
                    label: "Share",
                    onTap: () {
                      // Implement share functionality
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Sharing document...")),
                      );
                    },
                  ),
                  _buildActionButton(
                    icon: Icons.edit,
                    label: "Edit",
                    onTap: () {
                      // Implement edit functionality
                      Navigator.pop(context);
                    },
                  ),
                  _buildActionButton(
                    icon: Icons.delete,
                    label: "Delete",
                    onTap: () {
                      Navigator.pop(context);
                      _confirmDeleteDocument(document);
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF5F6), // Very light pink
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: const Color(0xFFFFB6C1).withOpacity(0.3), // Light pink
                width: 1.5,
              ),
            ),
            child: Icon(
              icon,
              color: const Color(0xFFFF8DA1), // Darker pink
              size: 20,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDeleteDocument(MedicalDocument document) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Delete Document?"),
        content: const Text(
          "This document will be permanently deleted. This action cannot be undone.",
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _savedDocuments.removeWhere((doc) => doc.id == document.id);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Document deleted")),
              );
            },
            child: const Text(
              "Delete",
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }

  Widget _cameraControlsRow() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 10,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Flash control
          IconButton(
            onPressed: () {
              if (_cameraController == null) return;

              setState(() {
                _flashMode = _flashMode == FlashMode.off
                    ? FlashMode.torch
                    : FlashMode.off;
              });

              _cameraController!.setFlashMode(_flashMode);
            },
            icon: Icon(
              _flashMode == FlashMode.off
                  ? Icons.flash_off_rounded
                  : Icons.flash_on_rounded,
              color: const Color(0xFFFF8DA1),
              size: 20,
            ),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
          const SizedBox(width: 20),

          // Camera switch button
          IconButton(
            onPressed: _switchCamera,
            icon: const Icon(
              Icons.flip_camera_ios_rounded,
              color: Color(0xFFFF8DA1),
              size: 20,
            ),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
          const SizedBox(width: 20),

          // Gallery pick button
          IconButton(
            onPressed: _pickImageFromGallery,
            icon: const Icon(
              Icons.photo_library_rounded,
              color: Color(0xFFFF8DA1),
              size: 20,
            ),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF5F6), // Very light pink background
      appBar: AppBar(
        backgroundColor: const Color(0xFFFFB6C1), // Light pink
        elevation: 0,
        title: const Text(
          "Medical Scanner",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline, color: Colors.white),
            onPressed: () {
              // Show help dialog
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text("Medical Scanner Help"),
                  content: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text("• Point camera at medical documents to scan"),
                      SizedBox(height: 8),
                      Text("• Keep the document flat and well-lit"),
                      SizedBox(height: 8),
                      Text("• Tap the camera button to capture"),
                      SizedBox(height: 8),
                      Text("• Import existing documents from gallery"),
                    ],
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text("Got it"),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Camera preview area
            Expanded(
              flex: 5, // Adjust this value to control camera preview size
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                child: _isCameraInitialized
                    ? Stack(
                        alignment: Alignment.center,
                        children: [
                          // Camera preview
                          ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: CameraPreview(_cameraController!),
                          ),

                          // Document frame overlay
                          Container(
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.white.withOpacity(0.6),
                                width: 2,
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            width: MediaQuery.of(context).size.width * 0.8,
                            height: MediaQuery.of(context).size.width * 1.1,
                          ),

                          // Animated scan line
                          AnimatedBuilder(
                            animation: _scanAnimation,
                            builder: (context, child) {
                              return Positioned(
                                top: MediaQuery.of(context).size.width *
                                    (_scanAnimation.value + 1) *
                                    0.55,
                                child: Container(
                                  width:
                                      MediaQuery.of(context).size.width * 0.8,
                                  height: 2,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.transparent,
                                        const Color(0xFFFFB6C1)
                                            .withOpacity(0.8),
                                        Colors.transparent,
                                      ],
                                      begin: Alignment.centerLeft,
                                      end: Alignment.centerRight,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),

                          // Camera controls row at the top
                          Positioned(
                            top: 20,
                            child: _cameraControlsRow(),
                          ),

                          // Hint text
                          Positioned(
                            bottom: 120,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.5),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Text(
                                "Position document within frame",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),

                          // Capture button
                          Positioned(
                            bottom: 40,
                            child: AnimatedBuilder(
                              animation: _pulseAnimation,
                              builder: (context, child) {
                                return Transform.scale(
                                  scale: _isProcessing
                                      ? 1.0
                                      : _pulseAnimation.value,
                                  child: GestureDetector(
                                    onTap: _isProcessing ? null : _captureImage,
                                    child: Container(
                                      width: 70,
                                      height: 70,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: const Color(0xFFFFB6C1),
                                          width: 3,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: const Color(0xFFFFB6C1)
                                                .withOpacity(0.3),
                                            blurRadius: 10,
                                            spreadRadius: 2,
                                          ),
                                        ],
                                      ),
                                      child: _isProcessing
                                          ? const CircularProgressIndicator(
                                              color: Color(0xFFFFB6C1),
                                              strokeWidth: 3,
                                            )
                                          : const Icon(
                                              Icons.camera_alt_rounded,
                                              color: Color(0xFFFF8DA1),
                                              size: 30,
                                            ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      )
                    : const Center(
                        child: CircularProgressIndicator(
                          color: Color(0xFFFFB6C1),
                        ),
                      ),
              ),
            ),

            // Recent documents section
            Expanded(
              flex: 2, // Adjust this value to control documents section size
              child: Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "Recent Documents",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF454545),
                            ),
                          ),
                          if (_savedDocuments.isNotEmpty)
                            TextButton(
                              onPressed: () {
                                // Navigate to all documents screen
                              },
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: const Text(
                                "View All",
                                style: TextStyle(
                                  color: Color(0xFFFFB6C1),
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: _savedDocuments.isEmpty
                          ? const Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.description_outlined,
                                    color: Color(0xFFFFB6C1),
                                    size: 36,
                                  ),
                                  SizedBox(height: 10),
                                  Text(
                                    "No scanned documents yet",
                                    style: TextStyle(
                                      color: Colors.grey,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          : ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _savedDocuments.length,
                              itemBuilder: (context, index) {
                                final document = _savedDocuments[
                                    _savedDocuments.length - 1 - index];
                                return GestureDetector(
                                  onTap: () => _showDocumentDetails(document),
                                  child: Container(
                                    width: 100,
                                    margin: const EdgeInsets.only(right: 12),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: const Color(0xFFFFB6C1)
                                            .withOpacity(0.3),
                                        width: 1.5,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.05),
                                          blurRadius: 5,
                                        ),
                                      ],
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Expanded(
                                          child: ClipRRect(
                                            borderRadius:
                                                const BorderRadius.vertical(
                                              top: Radius.circular(10),
                                            ),
                                            child: document.isSample
                                                ? Container(
                                                    color: Colors.grey[200],
                                                    child: Center(
                                                      child: Icon(
                                                        document.type ==
                                                                'Prescription'
                                                            ? Icons
                                                                .medical_services_outlined
                                                            : Icons
                                                                .description_outlined,
                                                        color: const Color(
                                                            0xFFFF8DA1),
                                                        size: 30,
                                                      ),
                                                    ),
                                                  )
                                                : Image.file(
                                                    File(document.path),
                                                    fit: BoxFit.cover,
                                                    width: double.infinity,
                                                  ),
                                          ),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.all(6),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                document.type,
                                                style: const TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.bold,
                                                  color: Color(0xFF454545),
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              Text(
                                                document.date.split(',')[0],
                                                style: TextStyle(
                                                  fontSize: 8,
                                                  color: Colors.grey[600],
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
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
}

class MedicalDocument {
  final String id;
  final String path;
  final String type;
  final String date;
  final String text;
  final bool isSample;

  MedicalDocument({
    required this.id,
    required this.path,
    required this.type,
    required this.date,
    required this.text,
    this.isSample = false,
  });
}
