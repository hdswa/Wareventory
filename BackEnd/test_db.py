import random

def generate_random_formatted_number():
    # Generate random numbers for each part
    first_part = f"{random.randint(0, 150):03d}"
    second_part = f"{random.randint(0, 25):02d}"
    third_part = f"{random.randint(0, 9)}"
    fourth_part = f"{random.randint(0, 9)}"

    formatted_number = f"{first_part}.{second_part}.{third_part}.{fourth_part}"
    return formatted_number

# Call the function to generate a random number
for i in range(100):
    random_formatted_number = generate_random_formatted_number()
    print(random_formatted_number)
 